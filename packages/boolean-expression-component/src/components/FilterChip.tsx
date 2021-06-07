/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling'
import React, { memo, useCallback, CSSProperties } from 'react'
import styled from 'styled-components'

export interface FilterChipProps {
	style?: CSSProperties
	className?: string
	value: string
	onClose(): void
}

export const FilterChip: React.FC<FilterChipProps> = memo(function FilterChip({
	value,
	onClose,
	style,
	className,
}) {
	return (
		<Container className={className} style={style}>
			<ValueText>{value}</ValueText>
			<CloseButton onClick={onClose} />
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

const CloseButton: React.FC<{
	onClick(): void
}> = memo(function CloseButton({ onClick }) {
	const handleClick = useCallback(() => onClick(), [onClick])
	return (
		<Icon
			iconName={'Clear'}
			onClick={handleClick}
			className={iconClass}
			color="white"
		/>
	)
})

const iconClass = mergeStyles({
	fontSize: 10,
	height: 10,
	width: 10,
	marginLeft: '10px',
	color: 'white',
	cursor: 'pointer',
})
