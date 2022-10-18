/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IIconProps } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

export function useCloseIconProps(iconProps?: IIconProps) {
	const theme = useTheme()
	return useMemo(
		() =>
			merge(
				{
					iconName: 'Cancel',
					styles: {
						root: {
							color: theme.palette.neutralPrimary,
						},
					},
				},
				iconProps,
			),
		[theme, iconProps],
	)
}
