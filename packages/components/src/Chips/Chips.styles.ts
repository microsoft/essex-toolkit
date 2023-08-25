/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ChipsStyles } from './Chips.types.js'
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { merge } from 'lodash-es'
import { useMemo } from 'react'

export function useChipsStyles(styles?: ChipsStyles) {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				display: 'flex',
				gap: 8,
				color: theme.palette.neutralPrimary,
				cursor: 'pointer',
				...styles?.root,
			},
			item: {
				gap: 8,
				alignItems: 'center',
				display: 'flex',
				padding: '2px 6px',
				borderRadius: 6,
				border: `1px solid ${theme.palette.neutralSecondary}`,
				...styles?.item,
			},
			icon: styles?.icon,
			close: merge(
				{
					root: {
						borderRadius: 0,
						padding: 0,
						margin: 0,
						marginLeft: 4,
						width: 16,
						height: 24,
						fontSize: 12,
						color: theme.palette.neutralSecondary,
					},
					rootHovered: {
						color: theme.palette.themePrimary,
						background: 'transparent',
					},
					rootPressed: {
						background: 'transparent',
					},
					icon: {
						margin: 0,
					},
				},
				styles?.close,
			),
		}),
		[theme, styles],
	)
}
