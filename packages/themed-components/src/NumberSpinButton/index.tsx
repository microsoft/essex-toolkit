/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpinButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning'
import { useCallback, useMemo } from 'react'
import * as React from 'react'

export interface NumberSpinButtonProps {
	label: string
	value: number
	min?: number
	max?: number
	step?: number
	onChange?: (n: number) => any
	labelPosition?: Position
}

/**
 * NumberSpinButton creates a thematic styled SpinButton from Fluent
 */
export const NumberSpinButton = ({
	label,
	value,
	min,
	max,
	step = 1,
	onChange,
	labelPosition,
}: NumberSpinButtonProps): JSX.Element => {
	// if the user doesn't specify these optional properties, we basically want it to spin forever
	const mn = min || value - 1
	const mx = max || value + 1
	const theme = useThematic()
	const handleChange = useCallback(
		(v: number) => {
			onChange && onChange(Math.min(mx, Math.max(mn, v)))
		},
		[onChange, mn, mx],
	)
	const handleIncrement = useCallback(
		(v: string) => {
			handleChange(parseFloat(v) + step)
		},
		[handleChange, step],
	)
	const handleDecrement = useCallback(
		(v: string) => {
			handleChange(parseFloat(v) - step)
		},
		[handleChange, step],
	)
	const handleValidate = useCallback(
		(v: string) => {
			handleChange(parseFloat(v))
		},
		[handleChange],
	)
	const styles = useMemo(
		() => ({
			input: { backgroundColor: theme.application().background().hex() },
		}),
		[theme],
	)
	return (
		<SpinButton
			// this is a weird kludge - the Fluent spin button does not seem to apply the background color properly
			styles={styles}
			value={value.toString()}
			onIncrement={handleIncrement}
			onDecrement={handleDecrement}
			onValidate={handleValidate}
			label={label}
			min={mn}
			max={mx}
			step={step}
			labelPosition={labelPosition}
		/>
	)
}
