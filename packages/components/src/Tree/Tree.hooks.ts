/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DirectionalHint, useTheme } from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'

import {
	useExpandIconButtonStyles,
	useExpandIconIconStyles,
	useItemButtonStyles,
} from './Tree.styles.js'
import type { TreeItemDetails, TreeStyles } from './Tree.types.js'

export interface Expansion {
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

export function useExpandIconProps(item: TreeItemDetails) {
	const iconStyles = useExpandIconIconStyles()
	const buttonStyles = useExpandIconButtonStyles()
	return useMemo(
		() => ({
			iconProps: {
				iconName: item.expanded ? 'ChevronDown' : 'ChevronRight',
				onClick: () => item.onExpand(),
				styles: iconStyles,
			},
			styles: buttonStyles,
		}),
		[item, iconStyles, buttonStyles],
	)
}

export function useItemMenuInteraction(
	item: TreeItemDetails,
	styles: TreeStyles,
) {
	const theme = useTheme()
	const [hovered, setHovered] = useState<boolean>(false)
	const onMouseEnter = useCallback(() => setHovered(true), [setHovered])
	const onMouseLeave = useCallback(() => setHovered(false), [setHovered])
	const [open, setOpen] = useState<boolean>(false)
	const onMenuClick = useCallback(() => setOpen(true), [setOpen])
	const onAfterMenuDismiss = useCallback(() => setOpen(false), [setOpen])
	const shown = item.menuItems && (hovered || open)
	const menuProps = useMemo(() => {
		if (item.menuItems && shown) {
			return {
				styles: {
					subComponentStyles: {
						menuItem: {
							root: {
								fontSize: 12,
								height: 24,
							},
							icon: {
								fontSize: 12,
							},
						},
					},
				},
				items: item.menuItems,
				calloutProps: {
					directionalHint: DirectionalHint.rightBottomEdge,
				},
			}
		}
	}, [item, shown])
	const menuIconProps = useMemo(() => {
		if (shown) {
			return {
				iconName: 'MoreVertical',
			}
		}
	}, [shown])
	const menuButtonStyles = useMemo(
		() => ({
			root: {
				width: 24,
				height: 24,
				fontSize: 12,
			},
		}),
		[],
	)
	const buttonStyles = useItemButtonStyles(item, shown)
	const listItemContentStyles = useMemo(
		() => ({
			...styles.listItemContent,
			background: hovered ? theme.palette.neutralLighter : 'unset',
		}),
		[theme, styles, hovered],
	)
	return {
		buttonStyles,
		listItemContentStyles,
		menuButtonStyles,
		menuProps,
		menuIconProps,
		onMouseEnter,
		onMouseLeave,
		onMenuClick,
		onAfterMenuDismiss,
	}
}
