/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Position } from '@fluentui/react'
import { SpinButton } from '@fluentui/react'
import { useCallback } from 'react'
export interface NumberSpinButtonProps {
	label: string
	value: number
	min?: number
	max?: number
	step?: number
	onChange?: (n: number) => any
	labelPosition?: Position
	incrementButtonAriaLabel?: string
	decrementButtonAriaLabel?: string
}

/**
 * NumberSpinButton creates a thematic styled SpinButton from Fluent
 */
export const NumberSpinButton = ({
	label,
	value,
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	step = 1,
	onChange,
	labelPosition,
	incrementButtonAriaLabel,
	decrementButtonAriaLabel,
}: NumberSpinButtonProps): JSX.Element => {
	// if the user doesn't specify these optional properties, we basically want it to spin forever
	const handleChange = useCallback(
		(v: number) => {
			if (onChange && v <= max && v >= min) {
				onChange(v)
			}
		},
		[onChange, min, max],
	)
	const handleIncrement = useCallback(
		(v: string) => {
			handleChange(Number.parseFloat(v) + step)
		},
		[handleChange, step],
	)
	const handleDecrement = useCallback(
		(v: string) => {
			handleChange(Number.parseFloat(v) - step)
		},
		[handleChange, step],
	)
	const handleValidate = useCallback(
		(v: string) => {
			handleChange(Number.parseFloat(v))
		},
		[handleChange],
	)
	return (
		<SpinButton
			value={value.toString()}
			onIncrement={handleIncrement}
			onDecrement={handleDecrement}
			onValidate={handleValidate}
			label={label}
			min={min}
			max={max}
			step={step}
			labelPosition={labelPosition}
			incrementButtonAriaLabel={incrementButtonAriaLabel}
			decrementButtonAriaLabel={decrementButtonAriaLabel}
		/>
	)
}
