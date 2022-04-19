/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IRenderFunction } from '@fluentui/react'
import type { ReactNode } from 'react'

/**
 * Props for the CollapsiblePanel
 */
export interface CollapsiblePanelProps {
	/**
	 * Title for the panel
	 */
	title?: string
	/**
	 * If true the initial state will be expanded
	 */
	defaultExpanded?: boolean
	/**
	 * Optional boolean to control the state outside this component
	 */
	expandedState?: boolean
	/**
	 * If it's the first element of the panel it applies a different style
	 */
	first?: boolean
	/**
	 * If it's the last element of the panel it applies a different style
	 */
	last?: boolean
	/**
	 * Optional function to render a different header than the default
	 */
	onRenderHeader?: IRenderFunction<any>
	/**
	 * Optional function to control the state outside the component
	 */
	onHeaderClick?: (nextState: boolean) => void
	children?: ReactNode
}

/**
 * The container that will have multiple
 * CollapsiblePanel as children, passing
 * the last and first params automatically.
 */
export interface CollapsiblePanelContainerProps {
	children?: ReactNode
}
