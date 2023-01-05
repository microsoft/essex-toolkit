/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Position, Slider } from '@fluentui/react'
import { useCallback } from 'react'

import { NumberSpinButton } from '../NumberSpinButton/NumberSpinButton.js'
import type { ControlProps } from './Settings.types.js'
import { ControlType } from './Settings.types.js'

/**
 * NumberControl creates either a thematic styled NumberSpinButton or Slider
 * from Fluent component
 * depending on control type specified.
 */
export const NumberControl = ({
	config,
	onChange,
}: ControlProps): JSX.Element => {
	const { key, value, type, label, control, params } = config
	const handleChange = useCallback(
		(n) => {
			onChange?.(key, n)
		},
		[key, onChange],
	)
	switch (control) {
		case ControlType.spinner:
			return (
				<NumberSpinButton
					key={`spinner-${key}`}
					label={label || ''}
					value={value}
					labelPosition={Position.top}
					incrementButtonAriaLabel={`increment ${JSON.stringify(label)}`}
					decrementButtonAriaLabel={`decrement ${JSON.stringify(label)}`}
					{...params}
					onChange={handleChange}
				/>
			)
		case ControlType.slider:
			return (
				<Slider
					key={`slider-${key}`}
					label={label}
					value={value}
					{...params}
					onChange={handleChange}
				/>
			)
		default:
			throw new Error(
				`Unsupported control type ${JSON.stringify(control)} for ${type}`,
			)
	}
}
