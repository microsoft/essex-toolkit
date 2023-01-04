/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import 'lineupjs/build/LineUpJS.css'

import { useThematic } from '@thematic/react'
import { builder as lineupBuilder } from 'lineupjs'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Filter } from './filters.js'
import { applyFilters } from './filters.js'
import type { ColumnConfig } from './lineup.js'
import {
	createNumberColorScale,
	nameToLabel,
	selectColumnBuilder,
} from './lineup.js'
import { ThematicLineupStyles } from './ThematicLineupStyles.js'

type LineUp = any

export interface ThematicLineupProps {
	/**
	 * List of data rows. This can be of any object type,
	 * the columns config should map the properties to columns.
	 */
	data: any[]
	/**
	 * Column configs to instantiate the LineUp instance.
	 */
	columns: ColumnConfig[]
	/**
	 * List of applied filters for the LineUp instance.
	 * This is different than LineUp's built-in filtering,
	 * allowing us to inject global overrides from external filter interfaces.
	 */
	filters?: Filter[]
	/**
	 * Whether to show the summary header histograms or not.
	 */
	histograms?: boolean
	/**
	 * If link columns exist, they contain a pattern property that needs template replacement.
	 * Some values are auto-replaced by LineUp, but for custom params, we need to supply a map.
	 * See, e.g., https://lineup.js.org/master/docs/interfaces/_model_linkcolumn_.ilinkdesc.html#pattern
	 */
	patternParams?: any
	/**
	 * Default column to sort by.
	 */
	defaultSortColumn?: string
	/**
	 * Whether to sort the default column ascending or descending.
	 */
	defaultSortAscending?: boolean
	width?: string | number
	height?: string | number
}

/**
 * This component manages a LineUp instance, while also applying default thematic styles and data colors.
 * Use it for a React-style JSX wrapper around LineUp that has more potential flexibility than the very
 * config-limited version exposed by the LineUp project.
 * This allows arbitrary column configs via JSON, and a set of global filters if desired.
 */
export const ThematicLineup = ({
	data,
	columns,
	filters,
	patternParams,
	histograms,
	defaultSortColumn,
	defaultSortAscending,
	width = '100%',
	height = 1000,
}: ThematicLineupProps): JSX.Element => {
	const theme = useThematic()
	const lineUpDivRef = useRef<HTMLDivElement>(null)
	const [lineup, setLineup] = useState<LineUp>()

	// TODO: for now we are hard-coding the default thematic nominal scale for all columns,
	// and for categoricals. we may want to give users control over nominal scale variant
	const numericColors = useMemo(
		() => createNumberColorScale(theme.scales().nominal, columns),
		[theme, columns],
	)

	const configDefaults = useMemo(
		() => ({
			// for columns needing template replacement
			params: patternParams,
			// for categorical columns needing to generate a categorical scale
			colors: (keys: any) => theme.scales().nominal(keys.length),
			// for numeric columns to pull the next color using a shared scale
			colorScale: numericColors,
		}),
		[theme, patternParams, numericColors],
	)

	useEffect(() => {
		if (lineUpDivRef.current) {
			// TODO: see if lineup api has a formal way to update the config
			lineUpDivRef.current.innerHTML = '' // clear the previous lineup table

			const builder = lineupBuilder(data)

			columns.forEach((config) => {
				const conf = {
					...configDefaults,
					...config,
				}
				const columnBuilder = selectColumnBuilder(config)
				const column = columnBuilder(conf, data)
				builder.column(column)
			})

			// TODO: our component wrapper should allow config of side panel too
			builder
				.defaultRanking()
				.sidePanel(false)
				.summaryHeader(histograms)
				.animated(false)

			const lineupInstance = builder.build(lineUpDivRef.current)
			setLineup(lineupInstance)
		}
	}, [theme, data, columns, patternParams, histograms, configDefaults])

	useEffect(() => {
		const col = nameToLabel(defaultSortColumn)
		lineup?.sortBy((arg: any) => arg.desc.label === col, defaultSortAscending)
	}, [lineup, defaultSortColumn, defaultSortAscending])

	useEffect(() => {
		lineup && filters && applyFilters(lineup, filters)
	}, [filters, lineup])

	return (
		<>
			<ThematicLineupStyles />
			<div style={{ width, height }} ref={lineUpDivRef} />
		</>
	)
}
