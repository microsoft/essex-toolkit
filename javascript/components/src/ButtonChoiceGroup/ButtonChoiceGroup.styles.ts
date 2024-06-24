/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IChoiceGroupOptionStyleProps,
	IChoiceGroupOptionStyles,
	IChoiceGroupStyleProps,
	IChoiceGroupStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

export function useChoiceGroupStyles(
	styles?: IStyleFunctionOrObject<IChoiceGroupStyleProps, IChoiceGroupStyles>,
): IStyleFunctionOrObject<IChoiceGroupStyleProps, IChoiceGroupStyles> {
	const theme = useTheme()
	return useMemo(
		() =>
			merge(
				{
					flexContainer: {
						display: 'inline-flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						borderRadius: 2,
						border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
					},
				},
				styles,
			),
		[theme, styles],
	)
}

export function useButtonOptionStyles(): IStyleFunctionOrObject<
	IChoiceGroupOptionStyleProps,
	IChoiceGroupOptionStyles
> {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				margin: 'unset',
				borderRadius: 2,
				backgroundColor: theme.palette.white,
			},
		}),
		[theme],
	)
}
