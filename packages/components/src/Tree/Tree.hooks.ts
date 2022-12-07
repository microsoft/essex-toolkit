/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useCallback, useMemo, useState } from 'react'

import type { Size } from '../hooks/fluent8/types.js'
import {
	useContentButtonStyles,
	useContentIconStyles,
	useExpandIconButtonStyles,
	useExpandIconIconStyles,
	useMenuButtonStyles,
	useMenuItemsStyles,
} from './Tree.styles.js'
import type {
	ExpandIconButtonProps,
	MenuButtonProps,
	TreeGroup,
	TreeItem,
	TreeItemDetails,
	TreeItemDetailsGroup,
	TreeStyles,
} from './Tree.types.js'

interface Expansion {
	is: (key: string) => boolean
	on: (key: string) => void
}
export function useExpansion(): Expansion {
	const [expandMap, setExpandMap] = useState<Record<string, boolean>>({})
	return useMemo(
		() => ({
			is: (key: string) => expandMap[key],
			on: (key: string) =>
				setExpandMap(prev => ({
					...prev,
					[key]: !prev[key],
				})),
		}),
		[expandMap, setExpandMap],
	)
}

export function useTreeItemGroups(
	items: TreeItem[],
	groups?: TreeGroup[],
	selectedKey?: string,
	onItemClick?: (item: TreeItem) => void,
	onItemExpandClick?: (item: TreeItem) => void,
): TreeItemDetailsGroup[] {
	const expansion = useExpansion()
	return useMemo(() => {
		const collected = collectItemsByGroup(items)
		return [
			...(groups || []),
			{
				key: rkey,
			},
		].map(group => ({
			...group,
			items: makeDetailedItems(
				collected.get(group.key) || [],
				0,
				expansion,
				selectedKey,
				onItemClick,
				onItemExpandClick,
			),
		}))
	}, [items, groups, expansion, selectedKey, onItemClick, onItemExpandClick])
}

const rkey = '--virtual-root--'

// sort items into groups, establishing a default group if none are provided
function collectItemsByGroup(items: TreeItem[]): Map<string, TreeItem[]> {
	return items.reduce((acc, cur) => {
		const group = cur.group || rkey
		const g = acc.get(group) || []
		g.push(cur)
		acc.set(group, g)
		return acc
	}, new Map<string, TreeItem[]>([[rkey, []]]))
}

// enrich each item recursively using top-level data
function makeDetailedItems(
	items: TreeItem[],
	depth: number,
	expansion: Expansion,
	selectedKey?: string,
	onItemClick?: (item: TreeItem) => void,
	onItemExpandClick?: (item: TreeItem) => void,
): TreeItemDetails[] {
	return items.map(item => {
		const { children, onClick, onExpand, selected, expanded, ...rest } = item
		const base: TreeItemDetails = {
			...rest,
			depth,
			selected: selected || item.key === selectedKey,
			expanded: expanded || expansion.is(item.key),
			onExpand: () => {
				expansion.on(item.key)
				if (onExpand) {
					onExpand(item)
				} else if (onItemExpandClick) {
					onItemExpandClick(item)
				}
			},
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
				onItemExpandClick,
			)
		}
		return base
	})
}

/**
 * The expand/collapse button for an item.
 * @param item
 * @returns
 */
export function useExpandIconButtonProps(
	item: TreeItemDetails,
	props?: ExpandIconButtonProps,
	size: Size = 'medium',
) {
	const buttonStyles = useExpandIconButtonStyles(size)
	const iconStyles = useExpandIconIconStyles(size)
	return useMemo(
		() =>
			merge(
				{
					iconProps: {
						iconName: item.expanded
							? props?.collapseIconName || 'ChevronDown'
							: props?.expandIconName || 'ChevronRight',
						onClick: () => item.onExpand(),
						styles: iconStyles,
					},
					styles: buttonStyles,
				},
				props,
			),
		[item, iconStyles, buttonStyles, props],
	)
}

/**
 * The main content button representing an item (optional icon + text)
 * @param item
 * @param props
 * @returns
 */
export function useContentButtonProps(
	item: TreeItemDetails,
	props?: IButtonProps,
	size: Size = 'medium',
) {
	const buttonStyles = useContentButtonStyles(item, size)
	const iconStyles = useContentIconStyles(size)
	return useMemo(
		() =>
			merge(
				{
					styles: buttonStyles,
					iconProps: {
						iconName: item.iconName,
						styles: iconStyles,
					},
				},
				props,
			),
		[item, buttonStyles, iconStyles, props],
	)
}

export function useItemHoverInteraction(
	item: TreeItemDetails,
	styles: TreeStyles,
) {
	const theme = useTheme()
	const [hovered, setHovered] = useState<boolean>(false)
	const onMouseEnter = useCallback(() => setHovered(true), [setHovered])
	const onMouseLeave = useCallback(() => setHovered(false), [setHovered])

	const listItemContentStyles = useMemo(
		() => ({
			background: hovered
				? theme.palette.neutralLighterAlt
				: item.selected
				? theme.palette.neutralLighter
				: 'unset',
			...styles.listItemContent,
		}),
		[theme, styles, item, hovered],
	)
	return {
		listItemContentStyles,
		hovered,
		onMouseEnter,
		onMouseLeave,
	}
}
/**
 * Interaction management for hovering the item row and clicking/dismissing menus.
 * @param item
 * @param styles
 * @returns
 */
export function useMenuButtonProps(
	item: TreeItemDetails,
	hovered: boolean,
	props?: MenuButtonProps,
	size: Size = 'medium',
) {
	const [open, setOpen] = useState<boolean>(false)
	const onMenuClick = useCallback(
		args => {
			setOpen(true)
			props?.onMenuClick && props.onMenuClick(args)
		},
		[setOpen, props],
	)
	const onAfterMenuDismiss = useCallback(() => {
		setOpen(false)
		props?.onAfterMenuDismiss && props?.onAfterMenuDismiss()
	}, [setOpen, props])
	const shown = hovered || open || props?.alwaysVisible
	const buttonStyles = useMenuButtonStyles(size)
	const menuItemsStyles = useMenuItemsStyles(size)
	const menuIconButtonProps = useMemo(() => {
		if (item.menuItems) {
			const base: IButtonProps = {
				styles: buttonStyles,
				menuProps: {
					items: item.menuItems,
					styles: menuItemsStyles,
				},
			}
			// layer in the base, user customization, and our logic
			return merge(base, props, {
				menuIconProps: {
					iconName: shown
						? props?.menuIconProps?.iconName || 'MoreVertical'
						: '',
				},
				onMenuClick,
				onAfterMenuDismiss,
			})
		}
	}, [
		item,
		shown,
		buttonStyles,
		menuItemsStyles,
		onMenuClick,
		onAfterMenuDismiss,
		props,
	])

	return menuIconButtonProps
}
