/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { Size } from '../hooks/fluent8/types.js'
import type { TreeItemDetails, TreeStyles } from './Tree.types.js'

// TODO: this should be merged with the fluent8 hooks content for reuse
const SMALL_SIZE = 24
const SMALL_FONT_SIZE = 12
const SMALL_CARET_FONT_SIZE = 8
const SMALL_INDICATOR_WIDTH = 1
const SMALL_ICON_SIZE = 14

const INDICATOR_HEIGHT = 14
const INDENT = 12
const ROOT_FLEX_GAP = 12
const FLEX_GAP = 0

const MEDIUM_CARET_FONT_SIZE = 10
const MEDIUM_INDICATOR_WIDTH = 2
/**
 * Only extract the styles props that matter for the root tree.
 * @param styles
 * @returns
 */
export function useTreeStyles(
	styles?: TreeStyles,
	size: Size = 'medium',
): TreeStyles {
	const theme = useTheme()
	return useMemo(() => {
		const base = {
			root: {
				display: 'flex',
				flexDirection: 'column',
				gap: ROOT_FLEX_GAP,
			},
			list: {
				padding: 0,
				margin: 0,
				listStyleType: 'none',
			},
			group: {
				display: 'flex',
				flexDirection: 'column',
			},
			groupHeader: {
				padding: 4,
				fontWeight: 'bold',
				color: theme.palette.neutralSecondary,
				background: theme.palette.neutralLighter,
			},
		}
		const small = size === 'small' && {
			groupHeader: {
				fontSize: SMALL_FONT_SIZE,
			},
		}
		return merge(base, small, styles)
	}, [theme, styles, size])
}

/**
 * Extract the styles per item so they can be modulated by item state.
 * @param item
 * @param styles
 * @returns
 */
export function useTreeItemStyles(
	item: TreeItemDetails,
	styles?: TreeStyles,
	size: Size = 'medium',
): TreeStyles {
	const theme = useTheme()
	return useMemo(() => {
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
				gap: FLEX_GAP,
			},
			flexContainer: {
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				gap: FLEX_GAP,
				paddingLeft: item.children
					? item.depth * INDENT
					: item.depth * INDENT + SMALL_SIZE,
			},
			indicator: {
				marginLeft: 2,
				height: INDICATOR_HEIGHT,
				borderRadius: MEDIUM_INDICATOR_WIDTH * 2,
				borderWidth: MEDIUM_INDICATOR_WIDTH,
				borderColor: item.selected ? theme.palette.themePrimary : 'transparent',
				borderStyle: 'solid',
			},
		}
		const small = size === 'small' && {
			listItemContent: {
				height: SMALL_SIZE,
			},
			indicator: {
				borderRadius: SMALL_INDICATOR_WIDTH * 2,
				borderWidth: SMALL_INDICATOR_WIDTH,
			},
		}
		return merge(base, small, styles)
	}, [theme, styles, item, size])
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
			},
		}
		const small = size === 'small' && {
			root: {
				width: SMALL_SIZE,
				height: SMALL_SIZE,
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
	item: TreeItemDetails,
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
				cursor: item.clickable ? 'pointer' : 'default',
			},
			label: {
				fontWeight: item.selected ? 'bold' : 'normal',
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
		return (
			size === 'small' && {
				root: {
					fontSize: SMALL_ICON_SIZE,
				},
			}
		)
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
			},
		}
		const small = size === 'small' && {
			root: {
				width: SMALL_SIZE,
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
