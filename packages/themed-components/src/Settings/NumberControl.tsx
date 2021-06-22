/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Slider } from '@fluentui/react'
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning'
import * as React from 'react'
import { useCallback } from 'react'
import { NumberSpinButton } from '../NumberSpinButton'
import { ControlType, ControlProps } from './interfaces'

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
		n => {
			onChange && onChange(key, n)
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
					incrementButtonAriaLabel={`increment ${label}`}
					decrementButtonAriaLabel={`decrement ${label}`}
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
			throw new Error(`Unsupported control type ${control} for ${type}`)
	}
}
