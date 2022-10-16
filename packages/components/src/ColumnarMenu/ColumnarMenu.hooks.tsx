/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonProps,
	IContextualMenuListProps,
	IContextualMenuProps,
} from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import merge from 'lodash-es/merge.js'
import { useCallback, useMemo } from 'react'

import { defaultButtonStyles } from './ColumnarMenu.styles.js'
import type { ColumnarMenuListProps } from './ColumnarMenu.types.js'
import { ColumnarMenuList } from './ColumnarMenuList.js'

export function useMenuProps(
	baseMenuProps: IContextualMenuProps,
	menuListProps?: Partial<ColumnarMenuListProps>,
) {
	const renderColumnarMenu: IRenderFunction<IContextualMenuListProps> =
		useCallback(
			menuProps =>
				menuProps ? (
					<ColumnarMenuList {...menuProps} {...menuListProps} />
				) : null,
			[menuListProps],
		)
	return useMemo(
		(): IContextualMenuProps => ({
			onRenderMenuList: renderColumnarMenu,
			...baseMenuProps,
		}),
		[baseMenuProps, renderColumnarMenu],
	)
}

export function useButtonProps(buttonProps?: IButtonProps) {
	return useMemo(
		() =>
			merge(
				{},
				{
					styles: defaultButtonStyles,
				},
				buttonProps,
			),
		[buttonProps],
	)
}
