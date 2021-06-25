/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IRenderFunction } from '@fluentui/react'

export interface CollapsiblePanelProps {
	title?: string
	defaultExpanded?: boolean
	expandedState?: boolean
	first?: boolean
	last?: boolean
	onRenderHeader?: IRenderFunction<any>
	onHeaderClick?: (nextState: boolean) => void
}

export interface CollapsiblePanelContainerProps {
	children: CollapsiblePanelProps[]
}
