/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useMemo } from 'react'

import type {
	BooleanOperation,
	FilterClause,
	FilterClauseGroup,
	Palette,
	WithChildren,
} from '../types.js'
import { toggleOperation } from '../utils.js'
import { BooleanOperationToggle as Toggle } from './BooleanOperationToggle.js'
import { CloseButton } from './CloseButton.js'
import { FilterChip } from './FilterChip.js'

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
			filters.map((f) => (
				/* TODO: restore onHover coloring */
				<FilterChip
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
						style={ToggleStyle}
						operation={operation}
						disabled={locked}
						onToggle={handleToggle}
						palette={palette}
					/>
				) : null}
				{chips}
				{onChipGroupDismissed ? (
					<CloseButton
						color='grey'
						onClick={() =>
							onChipGroupDismissed({ id, filters, label, locked, operation })
						}
					/>
				) : null}
			</Border>
		</Container>
	)
})

const ToggleStyle: React.CSSProperties = {
	margin: 4,
}

interface BorderProps extends WithChildren {
	borderColor: string
}

const Border: React.FC<BorderProps> = memo(function Border({
	borderColor,
	children,
}) {
	return <BorderContainer color={borderColor}>{children}</BorderContainer>
})

const Container: React.FC<WithChildren> = memo(function Container({
	children,
}) {
	return <div style={ContainerStyle}>{children}</div>
})
const ContainerStyle: React.CSSProperties = {
	padding: 4,
	marginTop: 2,
	position: 'relative',
	height: 38,
	display: 'flex',
	flexShrink: 0,
}

interface OperationTextProps extends WithChildren {
	backgroundColor: string
	color: string
}

const OperationText: React.FC<OperationTextProps> = memo(
	function OperationText({ color, backgroundColor, children }) {
		return (
			<div style={{ ...OperationTextStyle, color, backgroundColor }}>
				{children}
			</div>
		)
	},
)

const OperationTextStyle: React.CSSProperties = {
	position: 'absolute',
	left: 14,
	top: -4,
	fontSize: 10,
	fontWeight: 'bold',
	zIndex: 2,
	padding: '0 4px 0 4px',
}

interface BorderContainerProps extends WithChildren {
	color: string
}

const BorderContainer: React.FC<BorderContainerProps> = memo(
	function BorderContainer({ color, children }) {
		return (
			<div
				style={{
					...BorderContainerStyle,
					border: `2px solid ${color}`,
				}}
			>
				{children}
			</div>
		)
	},
)

const BorderContainerStyle: React.CSSProperties = {
	borderRadius: 10,
	display: 'flex',
	flexDirection: 'row',
	position: 'relative',
	alignItems: 'center',
	padding: '0 4px',
}
