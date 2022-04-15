/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSSProperties, FC } from 'react'
import { memo } from 'react'

import type { Palette } from '../types.js'
import { BooleanOperation } from '../types.js'
import { DEFAULT_PALETTE, NO_OP } from './constants.js'

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
	className?: string
	style?: CSSProperties
	color: string
	onClick: () => void
}

const Button: FC<ColorProps> = memo(function Button({
	color,
	children,
	style,
	className,
	onClick,
}) {
	return (
		<button
			className={className}
			style={{ ...ButtonStyle, color, border: `1px solid ${color}`, ...style }}
			onClick={onClick}
		>
			{children}
		</button>
	)
})

const ButtonStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	height: 20,
	backgroundColor: 'transparent',
	borderRadius: 5,
	padding: '0 3px',
	position: 'relative',
	outline: 'none',
}

const Text: FC = memo(function Text({ children }) {
	return <div style={TextStyle}>{children}</div>
})
const TextStyle: CSSProperties = {
	verticalAlign: 'middle',
	fontSize: 14,
	fontWeight: 400,
}
