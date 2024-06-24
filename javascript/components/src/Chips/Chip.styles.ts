/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ChipStyles } from './Chips.types.js'

import { useTheme } from '@fluentui/react'
import { merge } from 'lodash-es'
import { useMemo } from 'react'

export function useChipStyles(styles?: ChipStyles): ChipStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				gap: 8,
				alignItems: 'center',
				display: 'flex',
				padding: '2px 6px',
				borderRadius: 6,
				border: `1px solid ${theme.palette.neutralSecondary}`,
				...styles?.root,
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
