/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { BooleanOperation } from '../types'
import { toggleOperation } from '../utils'
import { BooleanOperationToggle } from './BooleanOperationToggle'
import { ChipGroup } from './ChipGroup'
import { FilterGroup, Filter } from './types'

export const FilterExpressionView: React.FC<{
	filters: FilterGroup[]
	operation: BooleanOperation
	onGlobalOperationChanged: (data: BooleanOperation) => void
	onChipDismissed: (filter: Filter) => void
	onOperationChanged: (id: string, operation: BooleanOperation) => void
}> = memo(function FilterChipSet({
	operation,
	filters,
	onChipDismissed,
	onOperationChanged,
	onGlobalOperationChanged,
}) {
	const chipContainerRef = useRef<HTMLDivElement>(null)
	const handleToggleGlobalOperation = useCallback(
		() => onGlobalOperationChanged(toggleOperation(operation)),
		[onGlobalOperationChanged, operation],
	)

	return (
		<ChipContainer ref={chipContainerRef}>
			{/* Global Boolean Operation */}
			{filters.length <= 1 ? null : (
				<Toggle operation={operation} onToggle={handleToggleGlobalOperation} />
			)}
			{/* Attribute Filters */}
			{filters.map(group => (
				<ChipGroup
					key={group.id}
					group={group}
					onChangeOperation={onOperationChanged}
					onDismiss={onChipDismissed}
				/>
			))}
		</ChipContainer>
	)
})

const Toggle = styled(BooleanOperationToggle)`
	margin: 3px 4px 0 4px;
`
const ChipContainer = styled.div`
	display: flex;
	padding: 1px;
	flex-direction: row;
	height: 100%;
	flex: 1 1 auto;
	overflow-x: auto;
	overflow-y: hidden;
	align-items: center;

	::-webkit-scrollbar {
		height: 3px;
		width: 3px;
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: #777;
		border-radius: 1ex;
		box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
		-webkit-border-radius: 1ex;
		-webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
	}
	::-webkit-scrollbar-corner {
		background: #000;
	}
`
