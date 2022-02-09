/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, CSSProperties } from 'react'
import styled from 'styled-components'
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
		<Container className={className} style={style}>
			<ValueText>{value}</ValueText>
			{hasCloseButton ? <CloseButton onClick={onClose} /> : null}
		</Container>
	)
})

const ValueText = styled.div`
	margin-left: 3px;
	vertical-align: middle;
	font-size: 14px;
	font-weight: 400;
	height: 100%;
`
const Container = styled.div`
	height: 20px;
	display: flex;
	flex-shrink: 0;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 3px;
	border: 1px solid grey;
	border-radius: 5px;
	background-color: #555;
	min-width: 50px;
	position: relative;
`
