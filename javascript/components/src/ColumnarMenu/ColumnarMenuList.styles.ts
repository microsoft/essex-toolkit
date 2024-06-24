/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { merge } from 'lodash-es'
import { useMemo } from 'react'

import type { ColumnarMenuListStyles } from './ColumnarMenu.types.js'

export function useStyles(
	styles?: ColumnarMenuListStyles,
): ColumnarMenuListStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			header: {
				color: theme.palette.themePrimary,
				padding: '8px 12px 0 12px',
				marginBottom: 8,
				fontWeight: 700,
				...styles?.header,
			},
			menu: {
				padding: 0,
				gap: 12,
				...styles?.menu,
			},
			options: {
				display: 'flex',
				...styles?.options,
			},
			column: {
				minWidth: 120,
				...styles?.column,
			},
			item: merge(
				{
					root: {
						paddingLeft: 8,
						height: 28,
						lineHeight: 28,
					},
					item: {
						listStyleType: 'none',
					},
				},
				styles?.item,
			),
		}),
		[theme, styles],
	)
}
