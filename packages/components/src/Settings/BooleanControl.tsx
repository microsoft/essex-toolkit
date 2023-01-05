/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Toggle } from '@fluentui/react'
import { useCallback } from 'react'

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
		(evt, checked) => {
			onChange?.(key, checked)
		},
		[key, onChange],
	)
	switch (control) {
		case ControlType.toggle:
			return (
				<Toggle
					key={`toggle-${key}`}
					label={label}
					checked={value}
					onChange={handleChange}
					inlineLabel
				/>
			)
		case ControlType.checkbox:
			return (
				<Checkbox
					key={`checkbox-${key}`}
					styles={{
						label: {
							// this is to match the overall label styling of the other controls, which is always bold
							fontWeight: 'bold',
						},
					}}
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
