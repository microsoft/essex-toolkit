/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonStyles,
	IContextualMenuListProps,
	IContextualMenuProps,
	IRenderFunction,
} from '@fluentui/react'
import { DefaultButton } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { ColumnarMenuList } from './ColumnarMenuList.js'

export interface ColumnarMenuProps extends IContextualMenuProps {
	text?: string
}

const dropdownButtonStyles: IButtonStyles = {
	root: {
		width: 220,
		// match the dropdowns for better visual alignment
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	label: {
		fontWeight: 'normal',
	},
}

/**
 * Dropdown button menu that supports grouped items (using sectionProps) in a columnar layout.
 */
export const ColumnarMenu: React.FC<ColumnarMenuProps> = memo(
	function ColumnarMenu(props) {
		const { onRenderMenuList, styles } = props
		const render: IRenderFunction<IContextualMenuListProps> = useCallback(
			menuProps => {
				if (onRenderMenuList) {
					return onRenderMenuList(menuProps)
				}
				return <ColumnarMenuList {...menuProps!} />
			},
			[onRenderMenuList],
		)
		const menuProps = useMemo(
			(): IContextualMenuProps => ({
				...props,
				onRenderMenuList: render,
				styles: { root: { width: 'auto' } },
			}),
			[props, render],
		)

		const buttonStyles = useMemo(
			() => ({
				...dropdownButtonStyles,
				...styles,
			}),
			[dropdownButtonStyles, styles],
		)
		return (
			<DefaultButton
				styles={buttonStyles}
				text={props.text}
				menuProps={menuProps}
			/>
		)
	},
)
