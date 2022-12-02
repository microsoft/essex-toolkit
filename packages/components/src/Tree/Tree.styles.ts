/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { TreeItemDetails, TreeStyles } from './Tree.types.js'

const SIZE = 24
const FONT_SIZE = 12
const CARET_FONT_SIZE = 8
const INDICATOR_HEIGHT = FONT_SIZE + 2
const INDICATOR_WIDTH = 2
const ICON_SIZE = 14
const INDENT = 12
const FLEX_GAP = 0

/**
 * Only extract the styles props that matter for the root tree.
 * @param styles
 * @returns
 */
export function useTreeStyles(styles?: TreeStyles): TreeStyles {
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

/**
 * Extract the styles per item so they can be modulated by item state.
 * @param item
 * @param styles
 * @returns
 */
export function useTreeItemStyles(
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
				...styles?.listItemContent,
			},
			flexContainer: {
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				gap: FLEX_GAP,
				paddingLeft: item.children
					? item.depth * INDENT
					: item.depth * INDENT + SIZE,
				...styles?.flexContainer,
			},
			indicator: {
				height: INDICATOR_HEIGHT,
				borderRadius: INDICATOR_WIDTH * 2,
				borderWidth: INDICATOR_WIDTH,
				borderColor: item.selected ? theme.palette.themePrimary : 'transparent',
				borderStyle: 'solid',
				...styles?.indicator,
			},
		}),
		[theme, styles, item],
	)
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
export function useExpandIconButtonStyles() {
	return useMemo(
		() =>
			merge(
				{
					root: {
						borderRadius: 0,
						padding: 0,
						margin: 0,
						width: SIZE,
						height: SIZE,
					},
				},
				transparentBackgroundButtonStyles,
			),
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
				color: theme.palette.neutralPrimaryAlt,
				fontSize: CARET_FONT_SIZE,
			},
		}),
		[theme],
	)
}

/**
 * The main item row in the list is represented as a button for (a) clickability/a11y, and (b) menu dropdown
 * @param item
 * @param hovered
 * @returns
 */
export function useContentButtonStyles(item: TreeItemDetails): IButtonStyles {
	return useMemo(
		() =>
			merge(
				{
					root: {
						border: 'none',
						borderRadius: 0,
						height: SIZE,
						fontSize: FONT_SIZE,
						textAlign: 'left',
						padding: 0,
						margin: 0,
						width: '100%',
						cursor: item.clickable ? 'pointer' : 'default',
					},
					label: {
						fontWeight: item.selected ? 'bold' : 'normal',
					},
				},
				transparentBackgroundButtonStyles,
			),
		[item],
	)
}

export function useContentIconStyles() {
	return useMemo(
		() => ({
			root: {
				fontSize: ICON_SIZE,
			},
		}),
		[],
	)
}

/**
 * These are the styles for the far-right menu button, if needed.
 * @returns
 */
export function useMenuButtonStyles() {
	return useMemo(
		() =>
			merge(
				{
					root: {
						width: SIZE,
						height: SIZE,
						fontSize: FONT_SIZE,
						borderRadius: 0,
					},
				},
				transparentBackgroundButtonStyles,
			),
		[],
	)
}

/**
 * These are the styles for the menu items in the dropdown (callout).
 * @returns
 */
export function useMenuItemsStyles() {
	return useMemo(
		() => ({
			subComponentStyles: {
				menuItem: {
					root: {
						fontSize: FONT_SIZE,
						height: SIZE,
					},
					icon: {
						fontSize: FONT_SIZE,
					},
				},
			},
		}),
		[],
	)
}
