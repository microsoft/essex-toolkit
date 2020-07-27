/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// tools to build lineup tables from json config
// much of this somewhat shadows interfaces within LineUp,
// but I didn't want to commit to full implementation right away
// as they converge we can switch directly over to LineUp interfaces
// if it seems useful

import { Color } from '@thematic/color'

/* eslint-disable @typescript-eslint/no-var-requires */
const {
	buildColumn: bc,
	buildStringColumn: bsc,
	buildCategoricalColumn: bcc,
	buildNumberColumn: bnc,
} = require('lineupjs')
type ColumnBuilder = any

export interface ColumnConfig {
	name: string
	type: string
	width?: number
	color?: string
	renderer?: string
	description?: string
	frozen?: boolean
	label?: string
}

export interface NumberColumnConfig extends ColumnConfig {
	domain?: [number, number]
	colorScale?: () => string
}

export interface LinkColumnConfig extends ColumnConfig {
	pattern?: string
	params?: Record<string, any>
}

export interface CategoricalColumnConfig extends ColumnConfig {
	categories?: string[]
	colors?: (keys: any[]) => (key: any) => Color
}

export type SetColumnConfig = CategoricalColumnConfig

const applyCommonConfig = (
	column: ColumnBuilder,
	config: ColumnConfig,
): void => {
	const { width, color, renderer, description, frozen, label } = config
	if (width) {
		column.width(width)
	}
	if (color) {
		column.color(color)
	}
	if (renderer) {
		column.renderer(renderer)
	}
	if (description) {
		column.description(description)
	}
	if (frozen) {
		column.frozen()
	}
	if (label) {
		column.label(label)
	}
}

/**
 * Gets unique list of categories for a column.
 * If the data property used for the column is a single value,
 * categoryKey is not required, because it is the same as
 * @param data
 * @param config
 */
export const deriveCategories = (
	config: ColumnConfig,
	data?: any[],
): string[] => {
	const categories = (data || []).reduce((acc, cur) => {
		const value = cur[config.name]
		const cats = Array.isArray(value) ? value : [value]
		cats.forEach((cat: string) => acc.add(cat))
		return acc
	}, new Set<string>())
	return Array.from(categories)
		.sort()
		.filter(c => c !== undefined) as string[]
}

/**
 * Creates a nominal scale for numeric column assignment.
 * This looks through the configs to count up the numeric columns,
 * so that each one can be assigned a unique color from the scale.
 * TODO: the scale function could be much more flexbile like d3 scales (domain/range), this just assumes an auto-incrementing index based on column order
 * @param scaleCreator Function that returns a scale. The returned scale should accept a number and return a mapped Color.
 * @param configs List of ColumnConfig object so we can count up the number columns
 */
export const createNumberColorScale = (
	scaleCreator: (count: number) => (index: number) => Color,
	configs: ColumnConfig[],
): (() => string) => {
	const finalCount = configs.reduce(
		(count: number, col: any) => (col.type === 'number' ? count + 1 : count),
		0,
	)
	const scale = scaleCreator(finalCount)
	let colorIndex = 0
	return () => scale(colorIndex++).hex()
}

/**
 * Builds a standard number column, applying supplied domain or computing as needed.
 * @param config
 * @param data
 */
export const buildNumberColumn = (
	config: NumberColumnConfig,
	data?: any[],
): any => {
	const domain =
		config.domain ||
		(data || []).reduce(
			(acc, cur) => {
				const value = cur[config.name]
				return value === undefined
					? acc
					: [Math.min(value, acc[0]), Math.max(value, acc[1])]
			},
			[Number.MAX_VALUE, Number.MIN_VALUE],
		)
	const color = config.colorScale && config.colorScale()
	const column = bnc(config.name, domain)
	applyCommonConfig(column, { color: color, ...config })
	return column
}

/**
 * Builds a boolean-based column, which is a variant on categorical.
 * Lineup only provides a subset of builders, so this wraps it with explicit typing.
 * @param config
 */
export const buildBooleanColumn = (config: ColumnConfig, data?: any[]): any => {
	const column = bc('boolean', config.name)
	applyCommonConfig(column, config)
	return column
}

/**
 * Builds a basic string column, which is also the default column type.
 * @param config
 * @param data
 */
export const buildStringColumn = (config: ColumnConfig, data?: any[]): any => {
	const column = bsc(config.name)
	applyCommonConfig(column, config)
	return column
}

/**
 * Builds a link column, which is a string column where the text is a hyperlink.
 * Note that pattern and params are optional config properties, that if omitted simply results in a plain string.
 * @param config
 * @param data
 */
export const buildLinkColumn = (
	config: LinkColumnConfig,
	data?: any[],
): any => {
	const column = buildStringColumn(config)
	if (config.pattern && config.params) {
		const pattern = Object.entries(config.params).reduce((acc, cur) => {
			const [key, value] = cur
			// NOTE: this is a concat because the ${} format is the template notation used by lineup!
			return acc.replace('${' + key + '}', value)
		}, config.pattern)
		column.pattern(pattern)
	}
	return column
}

/**
 * Builds a categorical column, computing the unique categories as needed.
 * @param config
 * @param data
 */
export const buildCategoricalColumn = (
	config: CategoricalColumnConfig,
	data?: any[],
): any => {
	const column = bcc(config.name)
	applyCommonConfig(column, config)
	const categories = config.categories || deriveCategories(config, data)
	const { colors = () => () => new Color('grey') } = config
	const scale = colors(categories)
	const finalCats = categories.map((s, i) => ({
		name: s,
		color: scale(i).hex(),
	}))
	column.categories(finalCats)
	return column
}

/**
 * Builds a set-style column, which is a form of categorical column.
 * Here we default the renderer to a heatmap.
 * @param config
 * @param data
 */
export const buildSetColumn = (config: SetColumnConfig, data?: any[]): any => {
	return buildCategoricalColumn(
		{ renderer: 'catheatmap', ...config },
		data,
	).asSet()
}

/**
 * Selects the column builder function based on data type indicated on the config.
 * TODO: support additional LineUp column types
 * @param config
 */
export const selectColumnBuilder = (config: ColumnConfig): any => {
	switch (config.type) {
		case 'number':
			return buildNumberColumn
		case 'boolean':
			return buildBooleanColumn
		case 'categorical':
			return buildCategoricalColumn
		case 'set':
			return buildSetColumn
		case 'link':
			return buildLinkColumn
		case 'string':
		default:
			return buildStringColumn
	}
}

/**
 * Converts a column name to a label by uppercasing the first letter.
 * This is used here because LineUp does not expose the names to us once
 * the instance is built, so we often have to filter based on the label.
 * Note that this is error-prone, because the label could be hand set by a dev.
 * See https://github.com/lineupjs/lineupjs/blob/23ca83caefc3200156d4a3af5d1f14c59db76657/src/builder/column/ColumnBuilder.ts#L7
 * @param name
 */
export const nameToLabel = (name?: string): string | undefined => {
	return name && name[0].toUpperCase() + name.slice(1)
}
