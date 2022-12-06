/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton, IconButton } from '@fluentui/react'
import { memo } from 'react'

import type { Expansion } from './Tree.hooks.js'
import {
	useContentButtonProps,
	useExpandIconButtonProps,
	useExpansion,
	useItemHoverInteraction,
	useMenuButtonProps,
} from './Tree.hooks.js'
import { useTreeItemStyles, useTreeStyles } from './Tree.styles.js'
import type {
	TreeItem,
	TreeItemDetails,
	TreeItemProps,
	TreeProps,
} from './Tree.types.js'

export const Tree: React.FC<TreeProps> = memo(function Tree({
	items,
	selectedKey,
	onItemClick,
	styles,
	expandButtonProps,
	contentButtonProps,
	menuButtonProps,
	size = 'medium',
}) {
	const _styles = useTreeStyles(styles)
	const expansion = useExpansion()
	const detailedItems = makeDetailedItems(
		items,
		0,
		expansion,
		selectedKey,
		onItemClick,
	)
	return (
		<div style={_styles.root}>
			<ul style={_styles.list}>
				{detailedItems.map(item => (
					<TreeItemNode
						key={item.key}
						item={item}
						styles={styles}
						expandButtonProps={expandButtonProps}
						contentButtonProps={contentButtonProps}
						menuButtonProps={menuButtonProps}
						size={size}
					/>
				))}
			</ul>
		</div>
	)
})

// enrich each item recursively using top-level data
function makeDetailedItems(
	items: TreeItem[],
	depth: number,
	expansion: Expansion,
	selectedKey?: string,
	onItemClick?: (item: TreeItem) => void,
): TreeItemDetails[] {
	return items.map(item => {
		const { children, onClick, selected, expanded, ...rest } = item
		const base: TreeItemDetails = {
			...rest,
			depth,
			selected: selected || item.key === selectedKey,
			expanded: expanded || expansion.is(item.key),
			onExpand: () => expansion.on(item.key),
			clickable: (onClick || onItemClick) !== undefined,
			onClick: () => {
				if (onClick) {
					onClick(item)
				} else if (onItemClick) {
					onItemClick(item)
				}
			},
		}
		if (children) {
			base.children = makeDetailedItems(
				children,
				depth + 1,
				expansion,
				selectedKey,
				onItemClick,
			)
		}
		return base
	})
}

/**
 * A TreeNode is contructed of buttons, selection indicators, and recursive children.
 * From the left:
 * (1) Selection indicator (pill), only displayed if item.selected is true
 * (2) Expand/collapse button, only visible if the item has children
 * (3) The main item content as a clickable button
 * (4) The far-right menu only shown on hover, and only if there are menu items
 *
 * The primary content resides within the listItemContent div, because that is the
 * level of interaction and styling we want for the row.
 * The outer li is too comprehensive because it grows if there are children.
 */
const TreeItemNode: React.FC<TreeItemProps> = memo(function TreeItem({
	item,
	styles,
	expandButtonProps,
	contentButtonProps,
	menuButtonProps,
	size,
}) {
	const _styles = useTreeItemStyles(item, styles, size)

	const _expandButtonProps = useExpandIconButtonProps(
		item,
		expandButtonProps,
		size,
	)
	const _contentButtonProps = useContentButtonProps(
		item,
		contentButtonProps,
		size,
	)

	const { listItemContentStyles, hovered, onMouseEnter, onMouseLeave } =
		useItemHoverInteraction(item, _styles)

	const _menuButtonProps = useMenuButtonProps(
		item,
		hovered,
		menuButtonProps,
		size,
	)
	return (
		<li style={_styles.listItem} key={`tree-item-li-${item.key}`}>
			<div
				style={listItemContentStyles}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<div style={_styles.indicator} />
				<div style={_styles.flexContainer}>
					{item.children && <IconButton {..._expandButtonProps} />}
					<DefaultButton {..._contentButtonProps} onClick={item.onClick}>
						{item.text}
					</DefaultButton>
					{item.menuItems && <IconButton {..._menuButtonProps} />}
				</div>
			</div>
			<ul style={_styles.list}>
				{item.children && item.expanded
					? item.children.map(child => (
							<TreeItemNode
								key={child.key}
								item={child}
								styles={styles}
								expandButtonProps={expandButtonProps}
								contentButtonProps={contentButtonProps}
								menuButtonProps={menuButtonProps}
								size={size}
							/>
					  ))
					: null}
			</ul>
		</li>
	)
})
