/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps, IButtonStyles, IIconProps } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { SMALL_FONT_SIZE, SMALL_INPUT_HEIGHT } from './constants.js'
import type { Size } from './types.js'

export function useButtonProps(
	props: Partial<IButtonProps>,
	size: Size = 'medium',
): Partial<IButtonProps> {
	const styles = useButtonStyles(props.styles, size)
	const iconProps = useIconProps(props.iconProps, size)
	return useMemo(
		() => merge({ styles, iconProps }, props),
		[styles, iconProps, props],
	)
}

export function useIconButtonProps(
	props: IButtonProps,
	size: Size = 'medium',
): IButtonProps {
	const styles = useIconButtonStyles(props.styles, size)
	const iconProps = useIconProps(props.iconProps, size)
	return useMemo(
		() => merge({ styles, iconProps }, props),
		[styles, iconProps, props],
	)
}

function useButtonStyles(styles?: IButtonStyles, size: Size = 'medium') {
	const sized = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					fontSize: SMALL_FONT_SIZE,
					height: SMALL_INPUT_HEIGHT,
					minWidth: 64,
					paddingLeft: 8,
					paddingRight: 8,
				},
				label: {
					fontWeight: 400,
				},
			}
		}
	}, [size])
	return useMemo(() => merge(sized, styles), [styles, sized])
}

function useIconButtonStyles(styles?: IButtonStyles, size: Size = 'medium') {
	const sized = useMemo(() => {
		if (size === 'small') {
			return {
				root: {
					minWidth: SMALL_FONT_SIZE * 2,
					width: SMALL_FONT_SIZE * 2,
					height: SMALL_FONT_SIZE * 2,
					paddingLeft: 4,
					paddingRight: 4,
				},
				flexContainer: {
					alignItems: 'center',
				},
				menuIcon: {
					fontSize: SMALL_FONT_SIZE,
					width: SMALL_FONT_SIZE,
					height: SMALL_FONT_SIZE,
					lineHeight: SMALL_FONT_SIZE,
				},
			}
		}
		return {}
	}, [size])
	return useButtonStyles(merge(sized, styles), size)
}

function useIconProps(
	iconProps?: IIconProps,
	size: Size = 'medium',
): IIconProps {
	const sized = useMemo(() => {
		if (size === 'small') {
			return {
				styles: {
					root: {
						fontSize: SMALL_FONT_SIZE,
						width: SMALL_FONT_SIZE,
						height: SMALL_FONT_SIZE,
						lineHeight: SMALL_FONT_SIZE,
					},
				},
			}
		}
		return {}
	}, [size])
	return useMemo(() => merge(sized, iconProps), [iconProps, sized])
}
