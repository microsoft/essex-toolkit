/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { parseSettings } from './reader'
import {
	SettingConfig,
	ParsedSettingConfig,
	SortedSettings,
	SortedSettingsGrouped,
} from './interfaces'
import { TextControl } from './TextControl'
import { NumberControl } from './NumberControl'
import { BooleanControl } from './BooleanControl'
import { useCallback } from 'react'
import { Stack, Separator } from '@fluentui/react'

interface Group {
	keys: string[]
	label?: string
}

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
	groups: Group[] = [],
): any[] => {
	const depleting = [...parsed]
	const grouped = groups.reduce((acc: any, cur: any) => {
		const { keys } = cur
		const settings = keys.map((key: any) => {
			const match = depleting.findIndex(s => s.key === key)
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

export interface SettingsProps {
	/**
	 * Required object to render into a settings panel.
	 * This can be basically anything, but should be flat
	 * at the moment, as complex/nest objects are not supported.
	 */
	settings: any
	/**
	 * Map of optional config params for individual settings.
	 * The key should match the key present in the settings object.
	 */
	config?: { [key: string]: SettingConfig }
	/**
	 * List of optional groups to sort the settings into, with a separator between each.
	 * The group is a list of the keys to include, with an optional label for the separator.
	 */
	groups?: Group[]
	/**
	 * Handler to notify when any of the settings has changed.
	 * Callback args will be the key and value that changed.
	 * Merging, etc. is up to the consumer.
	 *
	 */
	onChange?: (key: string, value: any) => void
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
		(key, value) => {
			onChange && onChange(key, value)
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
