/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useCallback, useMemo, useState } from 'react'

import type { Size } from '../hooks/fluent8/types.js'
import type {
	ExpandIconButtonProps,
	MenuButtonProps,
	TreeItem,
	TreeStyles,
} from './Tree.types.js'
import {
	useContentButtonStyles,
	useContentIconStyles,
	useExpandIconButtonStyles,
	useExpandIconIconStyles,
	useMenuButtonStyles,
	useMenuItemsStyles,
} from './TreeItem.styles.js'

/**
 * The expand/collapse button for an item.
 * @param item
 * @returns
 */
export function useExpandIconButtonProps(
	item: TreeItem,
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
						onClick: () => item.onExpand?.(item),
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
	item: TreeItem,
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

export function useItemHoverInteraction(item: TreeItem, styles: TreeStyles) {
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
	item: TreeItem,
	hovered: boolean,
	props?: MenuButtonProps,
	size: Size = 'medium',
) {
	const [open, setOpen] = useState<boolean>(false)
	const onMenuClick = useCallback(
		(args) => {
			setOpen(true)
			props?.onMenuClick?.(args)
		},
		[setOpen, props],
	)
	const onAfterMenuDismiss = useCallback(() => {
		setOpen(false)
		props?.onAfterMenuDismiss?.()
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
