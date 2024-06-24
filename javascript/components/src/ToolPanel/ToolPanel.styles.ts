/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

import type { ToolPanelStyles } from './ToolPanel.types.js'

export function useStyles(styles?: ToolPanelStyles): ToolPanelStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				height: '100%',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				...styles?.root,
			},
			header: {
				width: '100%',
				height: 36,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '0 0 0 8px',
				backgroundColor: theme.palette.neutralQuaternaryAlt,
				...styles?.header,
			},
			titleContainer: {
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				...styles?.titleContainer,
			},
			title: {
				width: '100%',
				fontSize: 12,
				color: theme.palette.neutralSecondary,
				textAlign: 'left',
				padding: 0,
				margin: 0,
				...styles?.title,
			},
			content: {
				height: '100%',
				width: '100%',
				overflowY: 'auto',
				...styles?.content,
			},
		}),
		[theme, styles],
	)
}
