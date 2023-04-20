/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type {
	ControlParams,
	ParsedSettingConfig,
	SettingConfig,
	SettingsConfig,
	SettingsGroup,
	SortedSettings,
	SortedSettingsGrouped,
} from './Settings.types.js'
import { ControlType } from './Settings.types.js'

/**
 * Sorts through settings to determine control type, etc. for each one.
 * Returned block is ready-to-render settings configs.
 */
export function useParsedSettings(
	settings?: any,
	config?: { [key: string]: SettingConfig },
) {
	return useMemo(() => parseSettings(settings, config), [settings, config])
}

/**
 * Applies optional grouping rules to settings.
 */
export function useGrouped(
	parsed: ParsedSettingConfig[],
	groups: SettingsGroup[],
) {
	return useMemo(() => sortIntoGroups(parsed, groups), [parsed, groups])
}

// this follows the label convention of Fluent, which is that the first word
// is capitalized and the rest are lowercase
const keyToLabel = (str: string): string => {
	return str
		.replace(/([a-z\d])([A-Z])/g, '$1 $2')
		.split(' ')
		.map((token, index) =>
			index === 0
				? token.substr(0, 1).toUpperCase() + token.substr(1).toLowerCase()
				: token.toLowerCase(),
		)
		.join(' ')
}

const selectDefaultControl = (
	type: string,
	params?: ControlParams,
): string | undefined => {
	switch (type) {
		case 'number':
			return ControlType.Spinner
		case 'boolean':
			return ControlType.Toggle
		default:
			if (params?.options) {
				if (params.options.length < 4) {
					return ControlType.Radio
				}
				return ControlType.Dropdown
			}
			return ControlType.Textbox
	}
}

/**
 * Parses a plain object into a config object suitable for the settings renderer.
 * If specific field config is supplied, this will be overlayed, otherwise defaults will be used.
 * @param settings
 */
const parseSettings = (
	settings: any = {},
	config: SettingsConfig = {},
): ParsedSettingConfig[] => {
	// start by creating a combined basic config using passed config first for order, and then adding in
	// any unaccounted for settings values
	const combined = Object.entries(settings).reduce(
		(acc, cur) => {
			const [key, value] = cur
			if (!acc[key]) {
				acc[key] = {
					defaultValue: value,
				}
			}
			return acc
		},
		{ ...config } as SettingsConfig,
	)
	const parsed = Object.entries(combined).reduce((acc: any, cur) => {
		const [key, conf] = cur
		const setting = settings[key]
		const value = setting || conf.defaultValue
		const type = typeof value || 'string'
		const entry = {
			key,
			value: value,
			type,
			control: conf.control || selectDefaultControl(type, conf.params),
			params: conf.params || {},
			label: keyToLabel(key),
		}
		return [...acc, entry]
	}, [])
	return parsed
}

const sortIntoGroups = (
	parsed: ParsedSettingConfig[],
	groups: SettingsGroup[] = [],
): any[] => {
	const depleting = [...parsed]
	const grouped = groups.reduce((acc: any, cur: any) => {
		const { keys } = cur
		const settings = keys.map((key: any) => {
			const match = depleting.findIndex((s) => s.key === key)
			return depleting.splice(match, 1)[0]
		})
		return [
			...acc,
			{
				...cur,
				separator: true,
				settings,
			},
		]
	}, [] as SortedSettingsGrouped[])
	return [
		// first is the remaining ungrouped, with no separator
		{
			settings: depleting,
		} as SortedSettings,
		...grouped,
	]
}
