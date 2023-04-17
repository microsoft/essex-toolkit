/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import { BooleanControl } from './BooleanControl.js'
import { NumberControl } from './NumberControl.js'
import { useGrouped, useParsedSettings } from './Settings.hooks.js'
import { containerStyle, groupContainerStyle } from './Settings.styles.js'
import type { ParsedSettingConfig, SettingsProps } from './Settings.types.js'
import { TextControl } from './TextControl.js'

/**
 * A zero-config settings panel that parses a supplied object
 * and generates a list of Fluent UI controls based on the data types.
 * A config object can be supplied that maps specific object fields to
 * more detailed control config, such as changing between a Toggle or Checkbox.
 * In addition, it will invoke a onChange handler for any setting, supplying the changed setting's key and new value.
 * Note that this could be used in an entirely declarative/serializable manner if desired.
 */
export const Settings = ({
	settings,
	config,
	groups = [],
	onChange,
}: SettingsProps): JSX.Element => {
	const parsed = useParsedSettings(settings, config)
	const handleChange = useCallback(
		(key: string, value: any) => onChange?.(key, value),
		[onChange],
	)
	const grouped = useGrouped(parsed, groups)
	const groupings = useMemo(() => grouped.map((group, i) => {
		const controls = group.settings.map((entry: any) =>
			renderControl(entry, handleChange),
		)
		return (
			<div key={`settings-group-${i}`}>
				{group.separator ? <Separator>{group.label}</Separator> : null}
				<div style={groupContainerStyle}>
					{controls}
				</div>
			</div>
		)
	}), [grouped, handleChange])
	return <div style={containerStyle}>{groupings}</div>
}

// chooses the top-level control type and renders it as a row
const renderControl = (
	config: ParsedSettingConfig,
	onChange: (key: any, value: any) => void,
): JSX.Element | null => {
	const { type } = config
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
	return <Control config={config} onChange={onChange} />
}
