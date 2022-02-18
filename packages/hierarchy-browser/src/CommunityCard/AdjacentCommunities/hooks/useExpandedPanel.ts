/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'
import { useContainerStyle } from '../../../hooks/theme.js'

interface IEdgePanelHook {
	isOpen: boolean
}

interface IEdgeState {
	edgeContentStyle: React.CSSProperties
	edgeEntitiesContentStyle: React.CSSProperties
	edgeEntitiesExpanderClick: (newState: boolean) => void
	edgeExpanderClick: (newState: boolean) => void
	edgeListOpen: boolean
	edgeEntitiesOpen: boolean
}

// Controls panel expansion state for neighbor communities and selected neighbor entities
export function useExpandedPanel({ isOpen }: IEdgePanelHook): IEdgeState {
	const [edgeListOpen, setEdgeListOpen] = useState<boolean>(true)
	const [edgeEntitiesOpen, setEdgeEntitiesOpen] = useState<boolean>(true)
	const edgeContentStyle = useContainerStyle(isOpen && edgeListOpen)
	const edgeEntitiesExpanderClick = useCallback(
		(newState: boolean) => {
			setEdgeEntitiesOpen(newState)
		},
		[setEdgeEntitiesOpen],
	)

	const edgeExpanderClick = useCallback(
		(newState: boolean) => {
			setEdgeListOpen(newState)
		},
		[setEdgeListOpen],
	)

	const edgeEntitiesContentStyle = useContainerStyle(isOpen && edgeEntitiesOpen)
	return {
		edgeContentStyle,
		edgeEntitiesContentStyle,
		edgeEntitiesExpanderClick,
		edgeExpanderClick,
		edgeListOpen,
		edgeEntitiesOpen,
	}
}
