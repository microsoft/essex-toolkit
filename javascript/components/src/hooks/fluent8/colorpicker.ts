/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IColorPickerProps,
	IColorPickerStyleProps,
	IColorPickerStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import {
	SMALL_FONT_SIZE,
	SMALL_INPUT_HEIGHT,
	SMALL_PILL_SIZE,
} from './constants.js'
import type { Size } from './types.js'

export function useColorPickerProps(
	props: Partial<IColorPickerProps>,
	size: Size = 'medium',
): Partial<IColorPickerProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

function useStyles(
	styles?: IStyleFunctionOrObject<IColorPickerStyleProps, IColorPickerStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					fontSize: SMALL_FONT_SIZE,
				},
				panel: {
					padding: 6,
				},
				colorRectangle: {
					minWidth: 168,
					minHeight: 168,
					marginBottom: 4,
					'.ms-ColorPicker-thumb': {
						width: SMALL_PILL_SIZE,
						height: SMALL_PILL_SIZE,
						':before': {
							borderWidth: 1,
						},
					},
				},
				flexSlider: {
					'.ms-ColorPicker-slider': {
						height: SMALL_PILL_SIZE,
						marginBottom: 4,
					},
					'.ms-ColorPicker-thumb': {
						width: SMALL_PILL_SIZE,
						height: SMALL_PILL_SIZE,
					},
				},
				tableHeader: {
					'> td': {
						fontSize: SMALL_FONT_SIZE - 2,
					},
				},
				input: {
					fontSize: SMALL_FONT_SIZE - 1,
					height: SMALL_INPUT_HEIGHT,
					'.ms-TextField-wrapper': {
						height: SMALL_INPUT_HEIGHT,
					},
					'.ms-TextField-fieldGroup': {
						height: SMALL_INPUT_HEIGHT,
					},
					'.ms-TextField-field': {
						height: SMALL_INPUT_HEIGHT,
						fontSize: SMALL_FONT_SIZE - 1,
						padding: 0,
						paddingLeft: 2,
						paddingRight: 2,
					},
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
