/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IIconProps } from '@fluentui/react'
import type { ChipStyles } from './Chips.types.js'

import { useMemo } from 'react'

export function useCloseIconProps(styles: ChipStyles): IIconProps {
	return useMemo(
		() => ({
			iconName: 'Cancel',
			styles: {
				root: {
					fontSize: styles?.root?.fontSize || 12,
				},
			},
		}),
		[styles],
	)
}
