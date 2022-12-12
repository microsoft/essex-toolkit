/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonProps,
	IContextualMenuItem,
	IRenderFunction,
} from '@fluentui/react'
import type { CSSProperties } from 'react'

import type { Size } from '../hooks/fluent8/types.js'

export interface TreeStyles {
	/**
	 * Styles for root container
	 */
	root?: CSSProperties
	/**
	 * Styles for each group container.
	 */
	group?: CSSProperties
	/**
	 * Styles for the group name text.
	 */
	groupHeader?: CSSProperties
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
	 * Optional group definitions.
	 * If groups are defined, each root item must have a group key.
	 */
	groups?: TreeGroup[]
	/**
	 * Selected item in the tree.
	 */
	selectedKey?: string
	/**
	 * Global handler for individual item clicks.
	 */
	onItemClick?: (item: TreeItem) => void
	/**
	 * Global handler for individual expand/collapse icon clicks.
	 */
	onItemExpandClick?: (item: TreeItem) => void
}

export interface TreeGroup {
	key: string
	text?: string
}

export interface TreeItem {
	key: string
	text?: string
	/**
	 * Key of the group this item belongs to, if groups are specified.
	 */
	group?: string
	/**
	 * Optional icon to show before the text.
	 */
	iconName?: string
	/**
	 * Individual click handler for this item.
	 * Will suppress top-level onItemClick if set.
	 */
	onClick?: (item: TreeItem) => void
	/**
	 * Individual click handler for this item's expand/collapse icon.
	 * Will suppress top-level onItemExpandClick if set.
	 */
	onExpand?: (item: TreeItem) => void
	/**
	 * Render function for the title content of the item. Includes the content *between* the expand/collapse button and the menu items.
	 */
	onRenderTitle?: IRenderFunction<TreeItemProps>
	/**
	 * Render function for the child content of the item, including child nodes.
	 */
	onRenderContent?: IRenderFunction<TreeItemProps>
	/**
	 * Indicates the item is selected and should be styled as such.
	 */
	selected?: boolean
	/**
	 * Indicates the item is expanded and should display child items and content.
	 */
	expanded?: boolean
	/**
	 * List of menu items to display in a right-side dropdown menu.
	 */
	menuItems?: IContextualMenuItem[]
	/**
	 * Child TreeItems to recursively render.
	 */
	children?: TreeItem[]
	/**
	 * Depth of the item, which affects its left position for hierarchical rendering.
	 */
	depth?: number
}

export interface TreeItemProps extends TreePropsBase {
	item: TreeItem
}
