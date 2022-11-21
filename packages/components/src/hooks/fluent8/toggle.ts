/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IStyleFunctionOrObject,
	IToggleProps,
	IToggleStyleProps,
	IToggleStyles,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import {
	SMALL_FONT_SIZE,
	SMALL_PILL_SIZE,
	SMALL_THUMB_SIZE,
} from './constants.js'
import type { Size } from './types.js'

export function useToggleProps(
	props: Partial<IToggleProps>,
	size: Size = 'medium',
): Partial<IToggleProps> {
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
	styles?: IStyleFunctionOrObject<IToggleStyleProps, IToggleStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					margin: 0,
				},
				container: {
					alignItems: 'center',
				},
				label: {
					fontSize: SMALL_FONT_SIZE,
				},
				pill: {
					height: SMALL_PILL_SIZE,
					width: SMALL_PILL_SIZE * 2,
					padding: 2,
					fontSize: SMALL_FONT_SIZE,
				},
				thumb: {
					width: SMALL_THUMB_SIZE,
					height: SMALL_THUMB_SIZE,
					fontSize: SMALL_THUMB_SIZE,
					borderWidth: SMALL_THUMB_SIZE / 2,
				},
				text: {
					fontSize: SMALL_FONT_SIZE,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
