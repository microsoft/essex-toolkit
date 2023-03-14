/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IDropdownProps,
	IDropdownStyleProps,
	IDropdownStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { SMALL_FONT_SIZE, SMALL_INPUT_HEIGHT } from './constants.js'
import type { Size } from './types.js'

export function useDropdownProps(
	props: Partial<IDropdownProps>,
	size: Size = 'medium',
): Partial<IDropdownProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

const item = {
	fontSize: SMALL_FONT_SIZE,
	height: SMALL_INPUT_HEIGHT,
	minHeight: SMALL_INPUT_HEIGHT,
	lineHeight: SMALL_INPUT_HEIGHT,
}

function useStyles(
	styles?: IStyleFunctionOrObject<IDropdownStyleProps, IDropdownStyles>,
	size: Size = 'medium',
) {
	const sizedBase = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					fontSize: SMALL_FONT_SIZE,
				},
				label: {
					fontSize: SMALL_FONT_SIZE,
					height: SMALL_INPUT_HEIGHT,
				},
				dropdown: item,
				dropdownItem: item,
				dropdownItemHeader: item,
				dropdownItemDisabled: item,
				dropdownItemSelected: item,
				dropdownItemSelectedAndDisabled: item,
				title: {
					...item,
					paddingTop: 3,
					lineHeight: 16,
				},
				caretDown: {
					...item,
					fontSize: 10,
					paddingTop: 3,
					lineHeight: 16,
				},
				caretDownWrapper: {
					...item,
					right: 6,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sizedBase, styles), [styles, sizedBase])
}
