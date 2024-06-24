/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'

import { useButtonProps, useMenuProps } from './ColumnarMenu.hooks.js'
import type { ColumnarMenuProps } from './ColumnarMenu.types.js'

/**
 * Dropdown button menu that supports grouped items (using sectionProps) in a columnar layout.
 * This is a hybrid control that uses a button to create the dropdown menu,
 * but overrides the menu renderer to lay out any item sections as columns instead of a vertical stack.
 */
export const ColumnarMenu: React.FC<ColumnarMenuProps> = memo(
	function ColumnarMenu({ text, buttonProps, menuListProps, ...props }) {
		const menuProps = useMenuProps(props, menuListProps)
		const _buttonProps = useButtonProps(buttonProps)

		return <DefaultButton {..._buttonProps} menuProps={menuProps} text={text} />
	},
)
