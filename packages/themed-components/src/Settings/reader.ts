/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	SettingsI,
	SettingConfig,
	ParsedSettingConfig,
} from './interfaces.js'
import { ControlType } from './interfaces.js'

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

const selectDefaultControl = (type: string): string | undefined => {
	switch (type) {
		case 'string':
			return ControlType.textbox
		case 'number':
			return ControlType.spinner
		case 'boolean':
			return ControlType.toggle
	}
}

/**
 * Parses a plain object into a config object suitable for the settings renderer.
 * If specific field config is supplied, this will be overlayed, otherwise defaults will be used.
 * @param settings
 */
export const parseSettings = (
	settings: SettingsI,
	config?: { [key: string]: SettingConfig },
): ParsedSettingConfig[] => {
	const parsed = Object.entries(settings).reduce((acc: any, cur) => {
		const [key, value] = cur
		const type = typeof value
		const entry = {
			key,
			value,
			type,
			control: selectDefaultControl(type),
			label: keyToLabel(key),
		}
		// TODO: is this expression necessary?
		/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
		acc[key]
		return [...acc, entry]
	}, [])
	if (!config) {
		return parsed
	}
	return parsed.map((setting: any) => {
		const conf = config[setting.key] || ({} as any)
		return {
			...setting,
			control: conf.control || setting.control,
			params: conf.params || {},
		}
	})
}
