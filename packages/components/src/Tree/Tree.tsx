/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton, IconButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { Expansion } from './Tree.hooks.js'
import {
	useExpandIconProps,
	useExpansion,
	useItemMenuInteraction,
} from './Tree.hooks.js'
import { useItemButtonStyles, useItemStyles, useStyles } from './Tree.styles.js'
import type {
	TreeItem,
	TreeItemDetails,
	TreeProps,
	TreeStyles,
} from './Tree.types.js'

export const Tree: React.FC<TreeProps> = memo(function Tree({
	items,
	selectedKey,
	onItemClick,
	styles,
}) {
	const _styles = useStyles(styles)
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
					<TreeItemNode key={item.key} item={item} styles={styles} />
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
	onClick?: (item: TreeItem) => void,
): TreeItemDetails[] {
	return items.map(item => {
		const { children, ...rest } = item
		const base: TreeItemDetails = {
			...rest,
			depth,
			selected: item.key === selectedKey,
			expanded: expansion.is(item.key),
			onExpand: () => expansion.on(item.key),
			clickable: onClick !== undefined,
			onClick: () => onClick && onClick(item),
		}
		if (children) {
			base.children = makeDetailedItems(
				children,
				depth + 1,
				expansion,
				selectedKey,
				onClick,
			)
		}
		return base
	})
}

const TreeItemNode: React.FC<{
	item: TreeItemDetails
	styles?: TreeStyles
}> = memo(function TreeItem({ item, styles }) {
	const _styles = useItemStyles(item, styles)

	const iconButtonProps = useExpandIconProps(item)
	const handleClick = useCallback(() => item.onClick(), [item])
	const buttonStyles = useItemButtonStyles(item)
	const iconProps = item.iconName
		? {
				iconName: item.iconName,
				styles: {
					root: {
						fontSize: 12,
					},
				},
		  }
		: undefined
	const {
		menuButtonStyles,
		menuProps,
		menuIconProps,
		onMouseEnter,
		onMouseLeave,
		onMenuClick,
		onAfterMenuDismiss,
	} = useItemMenuInteraction(item)
	// TODO: hover style on the entire row would be nice for consistency. right now you can see individual button elements
	return (
		<li style={_styles.listItem} key={`tree-item-li-${item.key}`}>
			<div style={_styles.listItemContent}>
				<div style={_styles.indicator} />

				<div style={_styles.flexContainer}>
					{item.children && <IconButton {...iconButtonProps} />}
					<DefaultButton
						styles={buttonStyles}
						iconProps={iconProps}
						onClick={handleClick}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						{item.text}
					</DefaultButton>
					{item.menuItems && (
						<IconButton
							styles={menuButtonStyles}
							menuProps={menuProps}
							menuIconProps={menuIconProps}
							onMouseEnter={onMouseEnter}
							onMouseLeave={onMouseLeave}
							onMenuClick={onMenuClick}
							onAfterMenuDismiss={onAfterMenuDismiss}
						/>
					)}
				</div>
			</div>
			<ul style={_styles.list}>
				{item.children && item.expanded
					? item.children.map(child => (
							<TreeItemNode key={child.key} item={child} styles={styles} />
					  ))
					: null}
			</ul>
		</li>
	)
})
