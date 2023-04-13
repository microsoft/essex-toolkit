/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator, Stack } from '@fluentui/react'
import { useCallback } from 'react'

import { BooleanControl } from './BooleanControl.js'
import { NumberControl } from './NumberControl.js'
import type {
	ParsedSettingConfig,
	SettingsGroup,
	SettingsProps,
	SortedSettings,
	SortedSettingsGrouped,
} from './Settings.types.js'
import { TextControl } from './TextControl.js'
import { parseSettings } from './reader.js'

// chooses the top-level control type and renders it as a row
const renderControl = (
	config: ParsedSettingConfig,
	onChange: (key: any, value: any) => void,
): JSX.Element | null => {
	const { key, type } = config
	let Control
	switch (type) {
		case 'string':
			Control = TextControl
			break
		case 'number':
			Control = NumberControl
			break
		case 'boolean':
			Control = BooleanControl
			break
		default:
			console.warn(`Data type ${type} not supported by settings`)
			return null
	}
	return (
		<div key={`settings-control-${key}`} style={{ marginBottom: 20 }}>
			<Control config={config} onChange={onChange} />
		</div>
	)
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

/**
 * A zero-config settings panel that  parses a supplied object
 * and generates a list of Fluent UI controls based on the data types.
 * A config object can be supplied that maps specific object fields to
 * more detailed control config, such as changing between a Toggle or Checkbox.
 * In addition, it will invoke a onChange handler for any setting, supplying the
 * changed setting's key and new value.
 * Note that this could be used in an entirely declarative/serializable manner if desired.
 */
export const Settings = ({
	settings,
	config,
	groups = [],
	onChange,
}: SettingsProps): JSX.Element => {
	const parsed = parseSettings(settings, config)
	const handleChange = useCallback(
		(key: string, value: any) => {
			onChange?.(key, value)
		},
		[onChange],
	)
	const grouped = sortIntoGroups(parsed, groups)
	const groupings = grouped.map((group, i) => {
		const controls = group.settings.map((entry: any) =>
			renderControl(entry, handleChange),
		)
		return (
			<Stack key={`settings-group-${i}`}>
				{group.separator ? <Separator>{group.label}</Separator> : null}
				{controls}
			</Stack>
		)
	})

	return <div>{groupings}</div>
}
