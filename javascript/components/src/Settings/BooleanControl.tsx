/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Toggle } from '@fluentui/react'
import { useCallback } from 'react'

import { checkboxStyles, toggleStyles } from './Settings.styles.js'
import type { ControlProps } from './Settings.types.js'
import { ControlType } from './Settings.types.js'

/**
 * BooleanControl creates either Checkbox or Toggle Fluent component
 * with thematic styling
 */
export const BooleanControl = ({
	config,
	onChange,
}: ControlProps): JSX.Element => {
	const { key, value, type, label, control } = config
	const handleChange = useCallback(
		(_evt: unknown, checked?: boolean | undefined) => onChange?.(key, checked),
		[key, onChange],
	)
	switch (control) {
		case ControlType.Toggle:
			return (
				<Toggle
					key={`toggle-${key}`}
					styles={toggleStyles}
					label={label}
					checked={value}
					onChange={handleChange}
					inlineLabel
				/>
			)
		case ControlType.Checkbox:
			return (
				<Checkbox
					key={`checkbox-${key}`}
					styles={checkboxStyles}
					label={label}
					checked={value}
					onChange={handleChange}
				/>
			)
		default:
			throw new Error(
				`Unsupported control type ${JSON.stringify(control)} for ${type}`,
			)
	}
}
