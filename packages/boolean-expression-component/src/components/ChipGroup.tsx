/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import {
	BooleanOperation,
	FilterClauseGroup,
	FilterClause,
	Palette,
} from '../types'
import { toggleOperation } from '../utils'
import { BooleanOperationToggle } from './BooleanOperationToggle'
import { CloseButton } from './CloseButton'
import { FilterChip } from './FilterChip'

export const ChipGroup: React.FC<{
	group: FilterClauseGroup
	onChangeOperation: (id: string, operation: BooleanOperation) => void
	onDismiss: (filter: FilterClause) => void
	onChipGroupDismissed?: (filterGroup: FilterClauseGroup) => void
	palette: Palette
}> = memo(function ChipGroup({
	group: { id, filters, label, locked, operation },
	palette,
	onDismiss,
	onChangeOperation,
	onChipGroupDismissed,
}) {
	const chips = useMemo(
		() =>
			filters.map(f => (
				<Chip
					key={f.id}
					value={f.label}
					onClose={() => onDismiss(f)}
					hasCloseButton={!onChipGroupDismissed}
				/>
			)),
		[filters, onDismiss, onChipGroupDismissed],
	)

	const handleToggle = useCallback(() => {
		if (!locked) {
			onChangeOperation(id, toggleOperation(operation))
		}
	}, [id, operation, locked, onChangeOperation])

	return (
		<Container>
			<OperationText
				color={palette.operations[operation]}
				backgroundColor={palette.backgroundColor}
			>
				{label}
			</OperationText>
			<Border borderColor={palette.operations[operation]}>
				{filters.length > 1 ? (
					<Toggle
						operation={operation}
						disabled={locked}
						onToggle={handleToggle}
						palette={palette}
					/>
				) : null}
				{chips}
				{onChipGroupDismissed ? (
					<CloseButton
						color="grey"
						onClick={() =>
							onChipGroupDismissed({ id, filters, label, locked, operation })
						}
					/>
				) : null}
			</Border>
		</Container>
	)
})

const Border: React.FC<{
	borderColor: string
}> = memo(function Border({ borderColor, children }) {
	return <BorderContainer color={borderColor}>{children}</BorderContainer>
})

const Container = styled.div`
	padding: 4px;
	margin-top: 2px;
	position: relative;
	height: 38px;
	display: flex;
	flex-shrink: 0;
`
const OperationText = styled.div<{ backgroundColor: string; color: string }>`
	position: absolute;
	color: ${({ color }) => color};
	left: 14px;
	top: -4px;
	font-size: 10px;
	font-weight: bold;
	z-index: 2;
	background-color: ${({ backgroundColor }) => backgroundColor};
	padding: 0 4px 0 4px;
`
const BorderContainer = styled.div<{ color: string }>`
	border: 2px solid ${({ color }) => color};
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
