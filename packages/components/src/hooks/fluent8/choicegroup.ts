/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IChoiceGroupOption,
	IChoiceGroupOptionStyles,
	IChoiceGroupProps,
	IChoiceGroupStyleProps,
	IChoiceGroupStyles,
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

export function useChoiceGroupProps(
	props: Partial<IChoiceGroupProps>,
	size: Size = 'medium',
): Partial<IChoiceGroupProps> {
	const styles = useStyles(size, props.styles)
	const options = useOptions(props.options, size)
	return useMemo(
		() => merge({ styles, options }, props),
		[styles, options, props],
	)
}

function useOptions(options?: IChoiceGroupOption[], size: Size = 'medium') {
	const styles = useOptionStyles(size)
	return useMemo(
		() => options?.map(o => merge({ styles }, o)),
		[options, styles],
	)
}

function useStyles(
	size: Size = 'medium',
	styles?: IStyleFunctionOrObject<IChoiceGroupStyleProps, IChoiceGroupStyles>,
) {
	const sized = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					fontSize: SMALL_FONT_SIZE,
				},
				label: {
					fontSize: SMALL_FONT_SIZE,
					height: SMALL_INPUT_HEIGHT,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sized, styles), [styles, sized])
}

const circle = {
	top: 2,
	left: 2,
	width: SMALL_PILL_SIZE,
	height: SMALL_PILL_SIZE,
}

const dot = {
	top: 4,
	left: 4,
	width: SMALL_THUMB_SIZE,
	height: SMALL_THUMB_SIZE,
	borderWidth: SMALL_THUMB_SIZE / 2,
}

function useOptionStyles(size: Size = 'medium'): IChoiceGroupOptionStyles {
	return useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					marginTop: 0,
					minHeight: SMALL_INPUT_HEIGHT,
					fontSize: SMALL_FONT_SIZE,
					'.ms-ChoiceFieldLabel': {
						paddingLeft: SMALL_FONT_SIZE + 6,
					},
				},
				field: {
					':before': circle,
					':after': dot,
					':hover': {
						':before': circle,
						':after': dot,
					},
					':focus': {
						':before': circle,
						':after': dot,
					},
				},
			}
		}
		return {}
	}, [size])
}
