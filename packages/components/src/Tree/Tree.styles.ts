/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { Size } from '../hooks/fluent8/types.js'
import type { TreeStyles } from './Tree.types.js'

// TODO: this should be merged with the fluent8 hooks content for reuse
const SMALL_FONT_SIZE = 12

const ROOT_FLEX_GAP = 12
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
