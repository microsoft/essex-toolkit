/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CSSProperties, memo } from 'react'
import styled from 'styled-components'
import { BooleanOperation, Palette } from '../types'
import { DEFAULT_PALETTE, NO_OP } from './constants'

export const BooleanOperationToggle: React.FC<{
	className?: string
	style?: CSSProperties
	operation: BooleanOperation
	disabled?: boolean
	onToggle?: () => void
	palette?: Palette
}> = memo(function BooleanOperationToggle({
	className,
	style,
	operation,
	disabled,
	palette = DEFAULT_PALETTE,
	onToggle = NO_OP,
}) {
	const color = disabled ? 'grey' : palette.operations[operation]
	const label = labels[operation]
	return (
		<Button
			className={className}
			style={style}
			color={color}
			onClick={onToggle}
		>
			<Text>{label}</Text>
		</Button>
	)
})

const labels: Record<BooleanOperation, string> = {
	[BooleanOperation.AND]: 'AND',
	[BooleanOperation.OR]: 'OR',
}

interface ColorProps {
	color: string
}
const Button = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 20px;
	background-color: transparent;
	color: ${({ color }: ColorProps) => color};
	border: 1px solid ${({ color }: ColorProps) => color};
	border-radius: 5px;
	padding: 0 3px;
	position: relative;
	outline: none;
`
const Text = styled.div`
	vertical-align: middle;
	font-size: 14px;
	font-weight: 400;
`
