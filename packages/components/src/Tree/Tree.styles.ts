/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

import type { TreeItemDetails, TreeStyles } from './Tree.types.js'

const FONT_SIZE = 12
const CARET_FONT_SIZE = 10
const INDENT = 12
const SIZE = 24
const FLEX_GAP = 0

export function useStyles(styles?: TreeStyles): TreeStyles {
	return useMemo(
		() => ({
			root: {
				fontSize: FONT_SIZE,
				...styles?.root,
			},
			list: {
				padding: 0,
				margin: 0,
				listStyleType: 'none',
				...styles?.list,
			},
		}),
		[styles],
	)
}

export function useItemStyles(
	item: TreeItemDetails,
	styles?: TreeStyles,
): TreeStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				fontSize: FONT_SIZE,
				...styles?.root,
			},
			list: {
				padding: 0,
				margin: 0,
				listStyleType: 'none',
				...styles?.list,
			},
			listItem: {
				paddingLeft: 1,
				width: '100%',
				...styles?.listItem,
			},
			listItemContent: {
				display: 'flex',
				alignItems: 'center',
				gap: FLEX_GAP,
				height: SIZE,
			},
			flexContainer: {
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				gap: FLEX_GAP,
				paddingLeft: item.children
					? item.depth * INDENT
					: item.depth * INDENT + SIZE,
			},
			indicator: {
				height: 14,
				border: `2px solid ${
					item.selected ? theme.palette.themePrimary : 'transparent'
				}`,
				borderRadius: 4,
				...styles?.indicator,
			},
		}),
		[theme, styles, item],
	)
}

export function useItemButtonStyles(item: TreeItemDetails) {
	return useMemo(
		() => ({
			root: {
				border: 'none',
				borderRadius: 0,
				height: 24,
				fontSize: 12,
				textAlign: 'left',
				padding: 0,
				width: '100%',
				cursor: item.clickable ? 'pointer' : 'default',
			},
			label: {
				fontWeight: 'normal',
			},
		}),
		[item],
	)
}

// styles for the IconButton
export function useExpandIconButtonStyles() {
	return useMemo(
		() => ({
			root: {
				borderRadius: 0,
				fontSize: CARET_FONT_SIZE,
				padding: 0,
				margin: 0,
				width: SIZE,
				height: SIZE,
			},
		}),
		[],
	)
}

// styles for the direct internal caret icon itself
export function useExpandIconIconStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				// this will default to theme color, but that's too busy for a tree caret
				color: theme.palette.neutralPrimary,
				fontSize: CARET_FONT_SIZE,
				margin: 0,
			},
		}),
		[theme],
	)
}
