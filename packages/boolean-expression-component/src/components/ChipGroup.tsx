/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { BooleanOperation } from '../types'
import { toggleOperation, booleanOperationColors } from '../utils'
import { BooleanOperationToggle } from './BooleanOperationToggle'
import { FilterChip } from './FilterChip'
import { FilterGroup, Filter } from './types'

export const ChipGroup: React.FC<{
	group: FilterGroup
	onChangeOperation: (id: string, operation: BooleanOperation) => void
	onDismiss: (filter: Filter) => void
}> = memo(function ChipGroup({
	group: { id, filters, name, locked, operation },
	onDismiss,
	onChangeOperation,
}) {
	const chips = useMemo(
		() =>
			filters.map(f => (
				<Chip key={f.id} value={f.value} onClose={() => onDismiss(f)} />
			)),
		[filters, onDismiss],
	)

	const handleToggle = useCallback(() => {
		if (!locked) {
			onChangeOperation(id, toggleOperation(operation))
		}
	}, [id, operation, locked, onChangeOperation])

	return (
		<Container>
			<OperationText color={booleanOperationColors[operation]}>
				{name}
			</OperationText>
			<Border operation={operation}>
				{filters.length > 1 ? (
					<Toggle
						operation={operation}
						disabled={locked}
						onToggle={handleToggle}
					/>
				) : null}
				{chips}
			</Border>
		</Container>
	)
})

const Border: React.FC<{
	operation: BooleanOperation
}> = memo(function Border({ operation, children }) {
	return (
		<BorderContainer color={booleanOperationColors[operation]}>
			{children}
		</BorderContainer>
	)
})

const Container = styled.div`
	padding: 4px;
	margin-top: 2px;
	position: relative;
	height: 38px;
	display: flex;
	flex-shrink: 0;
`
interface ColorProps {
	color: string
}
const OperationText = styled.div`
	position: absolute;
	color: ${({ color }: ColorProps) => color};
	left: 14px;
	top: -4px;
	font-size: 10px;
	font-weight: bold;
	z-index: 2;
	background-color: black;
	padding: 0 4px 0 4px;
`
const BorderContainer = styled.div`
	border: 2px solid ${({ color }: ColorProps) => color};
	border-radius: 10px;
	display: flex;
	flex-direction: row;
	position: relative;
	align-items: center;
	padding: 0 4px;
`
const Toggle = styled(BooleanOperationToggle)`
	margin: 4px;
`
const Chip = styled(FilterChip)`
	margin: 4px;
	&:hover {
		background-color: crimson;
	}
`
