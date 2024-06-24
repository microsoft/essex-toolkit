/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ILabelProps,
	ILabelStyleProps,
	ILabelStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { SMALL_FONT_SIZE, SMALL_INPUT_HEIGHT } from './constants.js'
import type { Size } from './types.js'

export function useLabelProps(
	props: Partial<ILabelProps>,
	size: Size = 'medium',
): Partial<ILabelProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

function useStyles(
	styles?: IStyleFunctionOrObject<ILabelStyleProps, ILabelStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					fontSize: SMALL_FONT_SIZE,
					height: SMALL_INPUT_HEIGHT,
					lineHeight: SMALL_FONT_SIZE,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
