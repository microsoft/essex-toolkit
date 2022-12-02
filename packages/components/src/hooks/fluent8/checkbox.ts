/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICheckboxProps,
	ICheckboxStyleProps,
	ICheckboxStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import {
	SMALL_FONT_SIZE,
	SMALL_INPUT_HEIGHT,
	SMALL_PILL_SIZE,
	SMALL_THUMB_SIZE,
} from './constants.js'
import type { Size } from './types.js'

export function useCheckboxProps(
	props: Partial<ICheckboxProps>,
	size: Size = 'medium',
): Partial<ICheckboxProps> {
	const styles = useStyles(props?.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}
/**
 * Note that this is renamed Switch in Fluent 9
 * @param styles
 * @param size
 * @returns
 */
function useStyles(
	styles?: IStyleFunctionOrObject<ICheckboxStyleProps, ICheckboxStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				checkbox: {
					marginRight: 2,
					width: SMALL_PILL_SIZE,
					height: SMALL_PILL_SIZE,
				},
				checkmark: {
					fontSize: SMALL_THUMB_SIZE,
					width: SMALL_THUMB_SIZE,
					height: SMALL_THUMB_SIZE,
				},
				label: {
					height: SMALL_INPUT_HEIGHT,
					alignItems: 'center',
				},
				text: {
					fontSize: SMALL_FONT_SIZE,
					marginLeft: 2,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
