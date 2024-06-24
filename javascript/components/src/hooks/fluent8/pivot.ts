/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IPivotProps,
	IPivotStyleProps,
	IPivotStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { SMALL_FONT_SIZE, SMALL_INPUT_HEIGHT } from './constants.js'
import type { Size } from './types.js'

export function usePivotProps(
	props: Partial<IPivotProps>,
	size: Size = 'medium',
): Partial<IPivotProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

function useStyles(
	styles?: IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				link: {
					height: SMALL_INPUT_HEIGHT,
					fontSize: SMALL_FONT_SIZE,
					lineHeight: SMALL_FONT_SIZE,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
