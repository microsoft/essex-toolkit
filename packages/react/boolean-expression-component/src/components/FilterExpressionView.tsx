/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useRef } from 'react'

import type {
	BooleanOperation,
	FilterClause,
	FilterClauseGroup,
	Palette,
} from '../types.js'
import { toggleOperation } from '../utils.js'
import { BooleanOperationToggle as Toggle } from './BooleanOperationToggle.js'
import { ChipGroup } from './ChipGroup.js'
import { DEFAULT_PALETTE, NO_OP } from './constants.js'

export const FilterExpressionView: React.FC<{
	filters: FilterClauseGroup[]
	operation: BooleanOperation
	palette?: Palette
	onGlobalOperationChanged?: (data: BooleanOperation) => void
	onChipDismissed?: (filter: FilterClause) => void
	onOperationChanged?: (id: string, operation: BooleanOperation) => void
	onChipGroupDismissed?: (filterGroup: FilterClauseGroup) => void
}> = memo(function FilterChipSet({
	operation,
	filters,
	palette = DEFAULT_PALETTE,
	onChipDismissed = NO_OP,
	onOperationChanged = NO_OP,
	onGlobalOperationChanged = NO_OP,
	onChipGroupDismissed,
}) {
	const chipContainerRef = useRef<HTMLDivElement>(null)
	const handleToggleGlobalOperation = useCallback(
		() => onGlobalOperationChanged(toggleOperation(operation)),
		[onGlobalOperationChanged, operation],
	)

	return (
		<div ref={chipContainerRef} style={ChipContainerStyle}>
			{/* Global Boolean Operation */}
			{filters.length <= 1 ? null : (
				<Toggle
					style={ToggleStyle}
					operation={operation}
					onToggle={handleToggleGlobalOperation}
					palette={palette}
				/>
			)}
			{/* Attribute Filters */}
			{filters.map(group => (
				<ChipGroup
					key={group.id}
					group={group}
					onChangeOperation={onOperationChanged}
					onDismiss={onChipDismissed}
					onChipGroupDismissed={onChipGroupDismissed}
					palette={palette}
				/>
			))}
		</div>
	)
})

const ToggleStyle: React.CSSProperties = {
	margin: '3px 4px 0 4px',
}
const ChipContainerStyle: React.CSSProperties = {
	display: 'flex',
	padding: 1,
	flexDirection: 'row',
	height: '100%',
	flex: '1 1 auto',
	overflowX: 'auto',
	overflowY: 'hidden',
	alignItems: 'center',
}
