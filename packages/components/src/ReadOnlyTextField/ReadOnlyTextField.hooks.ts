/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITextFieldProps } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

export function useBaseStyles(
	styles: ITextFieldProps['styles'],
): ITextFieldProps['styles'] {
	const theme = useTheme()
	return useMemo(() => {
		return merge(
			{
				field: {
					color: theme.palette.neutralTertiary,
				},
				fieldGroup: {
					borderColor: theme.palette.neutralTertiaryAlt,
				},
			},
			styles,
		)
	}, [theme, styles])
}
