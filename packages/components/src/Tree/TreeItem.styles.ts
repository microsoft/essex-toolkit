/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { Size } from '../hooks/fluent8/types.js'
import type { TreeItem, TreeStyles } from './Tree.types.js'

const INDICATOR_HEIGHT = 14

const DEPTH_TICK_WIDTH = 3
const DEPTH_TICK_HEIGHT = 1
const DEPTH_TICK_GAP = 2
const SHORT_TICK = 6

// standard size used in fluent controls
const MEDIUM_SIZE = 32
const MEDIUM_CARET_FONT_SIZE = 8
const MEDIUM_INDICATOR_WIDTH = 4
const MEDIUM_CARET_ICON_BUTTON_SIZE = 16
const MEDIUM_ICON_FONT_SIZE = 16
const MEDIUM_ICON_SIZE = 18
const MEDIUM_FIRST_INDENT = 8
const MEDIUM_INDENT = 14
const MEDIUM_LONG_TICK = SHORT_TICK + MEDIUM_CARET_ICON_BUTTON_SIZE

const SMALL_SIZE = 24
const SMALL_FONT_SIZE = 12
const SMALL_CARET_ICON_BUTTON_SIZE = 12
const SMALL_ICON_FONT_SIZE = 14
const SMALL_ICON_SIZE = 16
const SMALL_CARET_FONT_SIZE = 6
const SMALL_INDICATOR_WIDTH = 2
const SMALL_FIRST_INDENT = 6
const SMALL_INDENT = 12
const SHORT_LONG_TICK = SHORT_TICK + SMALL_CARET_ICON_BUTTON_SIZE

/**
 * Extract the styles per item so they can be modulated by item state.
 * @param item
 * @param styles
 * @returns
 */
export function useTreeItemStyles(
	item: TreeItem,
	styles?: TreeStyles,
	size: Size = 'medium',
	narrow = false,
): TreeStyles {
	const theme = useTheme()
	return useMemo(() => {
		const depth = item.depth || 0
		const base = {
			list: {
				padding: 0,
				margin: 0,
				listStyleType: 'none',
			},
			listItem: {
				width: '100%',
			},
			listItemContent: {
				display: 'flex',
				alignItems: 'center',
			},
			flexContainer: {
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				overflow: 'hidden',
				paddingLeft:
					depth === 0 ? 0 : MEDIUM_FIRST_INDENT + (depth - 1) * MEDIUM_INDENT,
			},
			hierarchyLine: {
				width: item.children ? SHORT_TICK : MEDIUM_LONG_TICK,
				minWidth: item.children ? SHORT_TICK : MEDIUM_LONG_TICK,
				height: MEDIUM_SIZE / 2,
				borderLeft: '1px solid',
				borderBottom: '1px solid',
				borderColor: theme.palette.neutralLight,
			},
			depthTicks: {
				width: DEPTH_TICK_WIDTH,
				minWidth: DEPTH_TICK_WIDTH,
				height: DEPTH_TICK_HEIGHT,
				background: theme.palette.neutralSecondaryAlt,
			},
			pill: {
				marginLeft: 2,
				marginRight: 2,
				width: MEDIUM_INDICATOR_WIDTH,
				background: item.selected ? theme.palette.themePrimary : 'transparent',
				height: INDICATOR_HEIGHT,
				borderRadius: MEDIUM_INDICATOR_WIDTH * 2,
			},
		}
		const small = size === 'small' && {
			flexContainer: {
				paddingLeft:
					depth === 0 ? 0 : SMALL_FIRST_INDENT + (depth - 1) * SMALL_INDENT,
			},
			hierarchyLine: {
				width: item.children ? SHORT_TICK : SHORT_LONG_TICK,
				minWidth: item.children ? SHORT_TICK : SHORT_LONG_TICK,
				height: SMALL_SIZE / 2,
			},
			indicator: {
				width: SMALL_INDICATOR_WIDTH,
				borderRadius: SMALL_INDICATOR_WIDTH * 2,
			},
		}
		// reduce paddings/widths/offsets so there is no depth
		const narrowed = narrow && {
			flexContainer: {
				paddingLeft: 0,
			},
		}
		return merge(base, small, narrowed, styles)
	}, [theme, styles, item, size, narrow])
}

// enforce transparency with a mixin for all button styles,
// so we can control hover/selection styling at the list item level
const transparentBackgroundButtonStyles = [
	'root',
	'rootFocused',
	'rootHovered',
	'rootPressed',
].reduce((acc, cur) => {
	acc[cur as keyof IButtonStyles] = {
		background: 'transparent',
	}
	return acc
}, {} as IButtonStyles)

// styles for the IconButton
export function useExpandIconButtonStyles(size: Size = 'medium') {
	return useMemo(() => {
		const base = {
			root: {
				borderRadius: 0,
				padding: 0,
				margin: 0,
				width: MEDIUM_CARET_ICON_BUTTON_SIZE,
				height: MEDIUM_CARET_ICON_BUTTON_SIZE,
			},
		}
		const small = size === 'small' && {
			root: {
				width: SMALL_CARET_ICON_BUTTON_SIZE,
				height: SMALL_CARET_ICON_BUTTON_SIZE,
			},
		}
		return merge(base, small, transparentBackgroundButtonStyles)
	}, [size])
}

// styles for the direct internal caret icon itself
export function useExpandIconIconStyles(size: Size = 'medium') {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				// this will default to theme color, but that's too busy for a tree caret
				color: theme.palette.neutralPrimaryAlt,
				fontSize:
					size === 'medium' ? MEDIUM_CARET_FONT_SIZE : SMALL_CARET_FONT_SIZE,
			},
		}),
		[theme, size],
	)
}

/**
 * The main item row in the list is represented as a button for (a) clickability/a11y, and (b) menu dropdown
 * @param item
 * @param hovered
 * @returns
 */
export function useContentButtonStyles(
	item: TreeItem,
	size: Size = 'medium',
): IButtonStyles {
	return useMemo(() => {
		const base = {
			root: {
				border: 'none',
				borderRadius: 0,
				textAlign: 'left',
				padding: 0,
				margin: 0,
				width: '100%',
				minWidth: 'unset',
				cursor: item.onClick ? 'pointer' : 'default',
			},
			flexContainer: {
				justifyContent: 'flex-start' as const,
				gap: 4,
			},
			label: {
				fontWeight: item.selected ? 'bold' : 'normal',
				whiteSpace: 'nowrap',
				margin: 0,
			},
		}
		const small = size === 'small' && {
			root: {
				height: SMALL_SIZE,
				fontSize: SMALL_FONT_SIZE,
			},
		}
		return merge(base, small, transparentBackgroundButtonStyles)
	}, [item, size])
}

export function useContentIconStyles(size: Size = 'medium') {
	return useMemo(() => {
		const base = {
			root: {
				fontSize: MEDIUM_ICON_FONT_SIZE,
				// 4 is the fluent default, but we've fixed the width so this is irrelevant
				margin: 0,
				width: MEDIUM_ICON_SIZE,
				minWidth: MEDIUM_ICON_SIZE,
			},
		}

		const small = size === 'small' && {
			root: {
				fontSize: SMALL_ICON_FONT_SIZE,
				width: SMALL_ICON_SIZE,
				minWidth: SMALL_ICON_SIZE,
			},
		}

		return merge(base, small)
	}, [size])
}

/**
 * These are the styles for the far-right menu button, if needed.
 * @returns
 */
export function useMenuButtonStyles(size: Size = 'medium') {
	return useMemo(() => {
		const base = {
			root: {
				borderRadius: 0,
				width: MEDIUM_SIZE,
				minWidth: MEDIUM_SIZE,
				height: MEDIUM_SIZE,
			},
		}
		const small = size === 'small' && {
			root: {
				width: SMALL_SIZE,
				minWidth: SMALL_SIZE,
				height: SMALL_SIZE,
				fontSize: SMALL_FONT_SIZE,
			},
		}
		return merge(base, small, transparentBackgroundButtonStyles)
	}, [size])
}

/**
 * These are the styles for the menu items in the dropdown (callout).
 * @returns
 */
export function useMenuItemsStyles(size: Size = 'medium') {
	return useMemo(() => {
		return size === 'small'
			? {
					subComponentStyles: {
						menuItem: {
							root: {
								fontSize: SMALL_FONT_SIZE,
								height: SMALL_SIZE,
							},
							icon: {
								fontSize: SMALL_FONT_SIZE,
							},
						},
					},
			  }
			: {}
	}, [size])
}
/**
 * Box container for the standard depth indicating "L".
 * Used to establish the correct size/flex.
 */
export function useHierarchyBoxStyle(size: Size = 'medium') {
	return useMemo(
		() => ({
			height: '100%',
			minHeight: size === 'medium' ? MEDIUM_SIZE : SMALL_SIZE,
			display: 'flex',
			flexDirection: 'column' as const,
			justifyContent: 'flex-start' as const,
		}),
		[size],
	)
}

/**
 * Box container for the narrow depth ticks, displayed as non-indented pips.
 * @param size
 */
export function useDepthTicksBoxStyle(size: Size = 'medium') {
	const box = useHierarchyBoxStyle(size)
	return useMemo(
		() => ({
			...box,
			justifyContent: 'center' as const,
			gap: DEPTH_TICK_GAP,
			marginRight: 2,
		}),
		[box],
	)
}
