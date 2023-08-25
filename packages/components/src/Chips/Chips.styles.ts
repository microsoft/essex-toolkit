/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useChipStyles } from './Chip.styles.js'
import type { ChipsStyles } from './Chips.types.js'

import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useChipsStyles(styles?: ChipsStyles): ChipsStyles {
	const theme = useTheme()
	const itemStyles = useChipStyles(styles?.item)
	return useMemo(
		() => ({
			root: {
				display: 'flex',
				gap: 8,
				color: theme.palette.neutralPrimary,
				cursor: 'pointer',
				...styles?.root,
			},
			item: itemStyles,
		}),
		[theme, styles, itemStyles],
	)
}
