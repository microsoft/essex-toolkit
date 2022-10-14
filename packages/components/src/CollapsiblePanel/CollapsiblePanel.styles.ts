/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { merge } from 'lodash-es'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'

import type { CollapsiblePanelStyles } from '../index.js'

export const buttonContainerStyle: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	height: '100%',
}

export const iconButtonStyle: React.CSSProperties = {}

export function useStyles(
	styles?: CollapsiblePanelStyles,
	expanded?: boolean,
	first?: boolean,
	last?: boolean,
): CollapsiblePanelStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				...styles?.root,
			},
			header: {
				background: theme.palette.neutralLighter,
				paddingTop: 2,
				paddingBottom: 2,
				paddingLeft: 4,
				width: '100%',
				display: 'flex',
				alignContent: 'center',
				cursor: 'pointer',
				borderTop: first ? '' : `1px solid ${theme.palette.neutralTertiaryAlt}`,
				borderBottom:
					last || expanded
						? `1px solid ${theme.palette.neutralTertiaryAlt}`
						: '',
				...styles?.header,
			},
			titleContainer: {
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				...styles?.titleContainer,
			},
			title: {
				fontSize: '0.8em',
				...styles?.title,
			},
			content: {
				width: '100%',
				border: expanded ? `1px solid ${theme.palette.neutralLighter}` : 'none',
				...styles?.content,
			},
		}),
		[theme, styles, expanded, first, last],
	)
}

export function useIconStyles(buttonProps?: IButtonProps, size = 10) {
	const theme = useTheme()
	return useMemo(
		() =>
			merge({
				root: {
					width: size,
					height: size,
					fontSize: size,
					lineHeight: size,
					color: theme.palette.neutralPrimary,
				},
				...buttonProps?.iconProps?.styles,
			}),
		[theme, buttonProps, size],
	)
}
