/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps, IContextualMenuItem } from '@fluentui/react'
import type { CSSProperties } from 'react'

import type { Size } from '../hooks/fluent8/types.js'

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
	 * Styles for content within each li. This is the primary "row" container.
	 */
	listItemContent?: CSSProperties
	/**
	 * Styles for the internal item row (li content) _not including the selection indicator_.
	 */
	flexContainer?: CSSProperties
	/**
	 * Style for the selected item indicator (pill on the left)
	 */
	indicator?: CSSProperties
}

export interface TreePropsBase {
	/**
	 * General styles for customizing the tree.
	 */
	styles?: TreeStyles
	/**
	 * Override props to customize the expand/collapse button (including its styles).
	 */
	expandButtonProps?: ExpandIconButtonProps
	/**
	 * Override props for the main button used to render each tree item's content.
	 * Note that this includes the iconProps if you want to customize how the item's icon (if any) looks.
	 */
	contentButtonProps?: IButtonProps
	/**
	 * Override props for the right-side menu item for each item (if they have menuItems).
	 */
	menuButtonProps?: MenuButtonProps
	/**
	 * Set the size mode of the tree
	 */
	size?: Size
}

export interface TreeProps extends TreePropsBase {
	/**
	 * List of items to render in the tree.
	 */
	items: TreeItem[]
	/**
	 * Handler for individual item clicks.
	 */
	onItemClick?: (item: TreeItem) => void
	/**
	 * Selected item in the tree.
	 */
	selectedKey?: string
}

export interface TreeItemProps extends TreePropsBase {
	item: TreeItemDetails
}

export interface TreeItem {
	key: string
	text: string
	iconName?: string
	menuItems?: IContextualMenuItem[]
	children?: TreeItem[]
}

export interface ExpandIconButtonProps extends IButtonProps {
	/**
	 * Icon name indicating that the list can be expanded (i.e., is in the closed position)
	 * Default: 'ChevronRight'
	 */
	expandIconName?: string
	/**
	 * Icon name indicating that the list can be collapsed (i.e., is in the open position)
	 * Default: 'ChevronDown'
	 */
	collapseIconName?: string
}

export interface MenuButtonProps extends IButtonProps {
	/**
	 * By default we only show the menu button icon on hover,
	 * to make it persistently visible set this to true.
	 */
	alwaysVisible?: boolean
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
