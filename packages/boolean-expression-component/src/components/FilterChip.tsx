/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSSProperties } from 'react'
import { memo } from 'react'
import { CloseButton } from './CloseButton.js'

export interface FilterChipProps {
	style?: CSSProperties
	className?: string
	value: string
	onClose(): void
	hasCloseButton?: boolean
}

export const FilterChip: React.FC<FilterChipProps> = memo(function FilterChip({
	value,
	onClose,
	style,
	className,
	hasCloseButton = true,
}) {
	return (
		<div className={className} style={{ ...ContainerStyle, ...style }}>
			<div style={ValueStyle}>{value}</div>
			{hasCloseButton ? <CloseButton onClick={onClose} /> : null}
		</div>
	)
})

const ValueStyle: React.CSSProperties = {
	marginLeft: 3,
	verticalAlign: 'middle',
	fontSize: 14,
	fontWeight: 400,
	height: '100%',
}

const ContainerStyle: React.CSSProperties = {
	height: 20,
	display: 'flex',
	flexShrink: 0,
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '0 3px',
	border: '1px solid grey',
	borderRadius: 5,
	backgroundColor: '#555',
	minWidth: 50,
	position: 'relative',
}
