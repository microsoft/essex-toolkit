/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ISpinButtonProps,
	ISpinButtonStyleProps,
	ISpinButtonStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { SMALL_FONT_SIZE, SMALL_INPUT_HEIGHT } from './constants.js'
import type { Size } from './types.js'

export function useSpinButtonProps(
	props: Partial<ISpinButtonProps>,
	size: Size = 'medium',
): Partial<ISpinButtonProps> {
	const styles = useStyles(props.styles, size)
	return useMemo(() => merge({ styles }, props), [styles, props])
}

const item = {
	fontSize: SMALL_FONT_SIZE,
	height: SMALL_INPUT_HEIGHT,
	minHeight: SMALL_INPUT_HEIGHT,
}

function useStyles(
	styles?: IStyleFunctionOrObject<ISpinButtonStyleProps, ISpinButtonStyles>,
	size: Size = 'medium',
) {
	const sized = useMemo(() => {
		if (size === 'small') {
			return {
				root: item,
				spinButtonWrapper: {
					...item,
					margin: 0,
				},
				labelWrapper: item,
				label: item,
				input: item,
				arrowButtonContainer: item,
			}
		}
	}, [size])
	return useMemo(() => merge(sized, styles), [styles, sized])
}
