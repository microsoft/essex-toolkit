/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react'
import type { CSSProperties } from 'react'

export interface TreeStyles {
	/**
	 * Styles for root container
	 */
	root?: CSSProperties
	/**
	 * Styles for recursive list containers (ul)
	 */
	list?: CSSProperties
	/**
	 * Styles for list items (li)
	 */
	listItem?: CSSProperties
	/**
	 * Styles for content within each li
	 */
	listItemContent?: CSSProperties
	/**
	 * Styles for the an item row (li content) _not including the selection indicator_
	 */
	flexContainer?: CSSProperties
	/**
	 * Style for the selected item indicator (thumb on the left)
	 */
	indicator?: CSSProperties
}

export interface TreeProps {
	items: TreeItem[]
	onItemClick?: (item: TreeItem) => void
	selectedKey?: string
	styles?: TreeStyles
}

export interface TreeItem {
	key: string
	text: string
	iconName?: string
	menuItems?: IContextualMenuItem[]
	children?: TreeItem[]
}

// internal interface used to provide an enriched item for rendering
export interface TreeItemDetails extends TreeItem {
	depth: number
	selected: boolean
	expanded: boolean
	clickable: boolean
	children?: TreeItemDetails[]
	onClick: () => void
	onExpand: () => void
}
