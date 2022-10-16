/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps, IRenderFunction } from '@fluentui/react'
import type { CSSProperties } from 'react'

export interface CollapsiblePanelStyles {
	/**
	 * Style for outer component container
	 */
	root?: CSSProperties
	/**
	 * Style for the outer header container
	 */
	header?: CSSProperties
	/**
	 * Container box around the title text
	 */
	titleContainer?: CSSProperties
	/**
	 * Style for the header title text
	 */
	title?: CSSProperties
	/**
	 * Style for the content container
	 */
	content?: CSSProperties
}

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
	expanded?: boolean
	/**
	 * If it's the first element of the panel it applies a different style
	 */
	first?: boolean
	/**
	 * If it's the last element of the panel it applies a different style
	 */
	last?: boolean
	/**
	 * Optional function to render a different header than the default.
	 * Note that if you supply a custom header renderer with interactive controls,
	 * you may need to call e.stopPropagation in their click handlers to prevent
	 * unwanted expand/collapse behavior.
	 */
	onRenderHeader?: IRenderFunction<any>
	/**
	 * Optional function to control the state outside the component
	 */
	onHeaderClick?: (nextState: boolean) => void
	/**
	 * Custom styles for the subcomponents
	 */
	styles?: CollapsiblePanelStyles
	/**
	 * Duration of the expand/collapse content animation.
	 */
	duration?: number
	/**
	 * Hide the expand/collapse icon entirely. It is visible by default.
	 */
	hideIcon?: boolean
	/**
	 * Custom props for the expand/collapse icon button.
	 */
	buttonProps?: IButtonProps
}

/**
 * The container that will have multiple
 * CollapsiblePanel as children, passing
 * the last and first params automatically.
 */
export interface CollapsiblePanelContainerProps {
	styles?: {
		root?: CSSProperties
	}
}
