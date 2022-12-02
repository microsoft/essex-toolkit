/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	INavProps,
	INavStyleProps,
	INavStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import {
	SMALL_FONT_SIZE,
	SMALL_INPUT_HEIGHT,
	SMALL_THUMB_SIZE,
} from './constants.js'
import type { Size } from './types.js'

export function useNavProps(
	props: Partial<INavProps>,
	size: Size = 'medium',
): Partial<INavProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

function useStyles(
	styles?: IStyleFunctionOrObject<INavStyleProps, INavStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				group: {
					fontSize: SMALL_FONT_SIZE,
				},
				groupContent: {
					marginBottom: SMALL_THUMB_SIZE,
				},
				chevronButton: {
					fontSize: SMALL_FONT_SIZE,
					height: SMALL_INPUT_HEIGHT,
					lineHeight: SMALL_INPUT_HEIGHT,
					margin: 0,
				},
				chevronIcon: {
					fontSize: 10,
					height: SMALL_INPUT_HEIGHT,
					lineHeight: SMALL_INPUT_HEIGHT,
				},
				link: {
					fontSize: SMALL_FONT_SIZE,
					height: SMALL_INPUT_HEIGHT,
					lineHeight: SMALL_INPUT_HEIGHT,
					paddingRight: 8,
				},
				linkText: {
					margin: 0,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
