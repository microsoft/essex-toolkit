/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonProps,
	IContextualMenuItemStyles,
	IContextualMenuListProps,
	IContextualMenuProps,
} from '@fluentui/react'
import type { CSSProperties } from 'react'

export interface ColumnarMenuProps extends IContextualMenuProps {
	/**
	 * Text to display in the menu button
	 */
	text?: string
	/**
	 * Props to customize the menu button
	 */
	buttonProps?: IButtonProps
	menuListProps?: Partial<ColumnarMenuListProps>
}

export interface ColumnarMenuListStyles {
	header?: CSSProperties
	menu?: CSSProperties
	options?: CSSProperties
	column?: CSSProperties
	item?: IContextualMenuItemStyles
}

export interface ColumnarMenuListProps extends IContextualMenuListProps {
	styles?: ColumnarMenuListStyles
}
