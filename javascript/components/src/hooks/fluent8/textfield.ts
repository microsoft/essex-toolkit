/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IStyleFunctionOrObject,
	ITextFieldProps,
	ITextFieldStyleProps,
	ITextFieldStyles,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { SMALL_FONT_SIZE, SMALL_INPUT_HEIGHT } from './constants.js'
import type { Size } from './types.js'

export function useTextFieldProps(
	props: Partial<ITextFieldProps>,
	size: Size = 'medium',
): Partial<ITextFieldProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

const item = {
	fontSize: SMALL_FONT_SIZE,
	height: SMALL_INPUT_HEIGHT,
	lineHeight: SMALL_FONT_SIZE,
}

function useStyles(
	styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				root: item,
				wrapper: item,
				fieldGroup: item,
				field: item,
				subComponentStyles: {
					label: {
						root: {
							fontSize: SMALL_FONT_SIZE,
						},
					},
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
