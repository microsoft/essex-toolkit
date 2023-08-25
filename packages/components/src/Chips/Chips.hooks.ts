/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ChipsStyles } from './Chips.types.js'
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useCloseIconProps(styles: ChipsStyles) {
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
