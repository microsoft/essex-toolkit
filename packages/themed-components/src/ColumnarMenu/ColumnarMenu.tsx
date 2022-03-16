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
import { merge } from 'lodash-es'
import { memo, useCallback, useMemo } from 'react'

import { ColumnarMenuList } from './ColumnarMenuList.js'

export interface ColumnarMenuProps extends IContextualMenuProps {
	text?: string
	buttonStyles?: IButtonStyles
}

const dropdownButtonStyles: IButtonStyles = {
	root: {
		// match the dropdowns for better visual alignment
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	label: {
		whiteSpace: 'nowrap',
		fontWeight: 'normal',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}

/**
 * Dropdown button menu that supports grouped items (using sectionProps) in a columnar layout.
 */
export const ColumnarMenu: React.FC<ColumnarMenuProps> = memo(
	function ColumnarMenu(props) {
		const { onRenderMenuList, buttonStyles } = props
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
				onRenderMenuList: render,
				...props,
				styles: merge(props.styles, {
					root: { width: 'auto' },
				}),
			}),
			[props, render],
		)

		const buttonStyle = merge(dropdownButtonStyles, buttonStyles)

		return (
			<DefaultButton
				disabled={!menuProps.items.length}
				styles={buttonStyle}
				text={props.text}
				menuProps={menuProps}
			/>
		)
	},
)
