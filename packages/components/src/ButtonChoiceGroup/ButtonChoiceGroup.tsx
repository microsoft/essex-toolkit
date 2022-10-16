/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IChoiceGroupOption,
	IChoiceGroupOptionProps,
	IChoiceGroupProps,
} from '@fluentui/react'
import { ChoiceGroup, DefaultButton, IconButton } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { memo, useMemo } from 'react'

import {
	useButtonOptionStyles,
	useChoiceGroupStyles,
} from './ButtonChoiceGroup.styles.js'

/**
 * ButtonChoiceGroup is a ChoiceGroup component that renders as buttons instead of radios.
 */
export const ButtonChoiceGroup: React.FC<IChoiceGroupProps> = memo(
	function ButtonChoiceGroup({ options, styles, ...props }) {
		const choiceGroupStyles = useChoiceGroupStyles(styles)
		const buttonOptionStyles = useButtonOptionStyles()
		const buttonOptions = useMemo(
			(): IChoiceGroupOption[] | undefined =>
				options?.map(option =>
					merge(
						{
							styles: buttonOptionStyles,
							onRenderField,
						} as IChoiceGroupOption,
						option,
					),
				),
			[options, buttonOptionStyles],
		)

		return (
			<ChoiceGroup
				{...props}
				options={buttonOptions}
				styles={choiceGroupStyles}
			/>
		)
	},
)

const onRenderField = (props?: IChoiceGroupOptionProps) => {
	const iconOnly = props?.iconProps && !props.text
	const shared = {
		title: props?.title,
		iconProps: props?.iconProps,
		toggle: true,
		checked: props?.checked,
		onClick: () => props?.onChange?.(undefined, props),
	}
	return iconOnly ? (
		<IconButton {...shared} />
	) : (
		<DefaultButton style={defaultButtonStyle} {...shared}>
			{props?.text}
		</DefaultButton>
	)
}

const defaultButtonStyle: React.CSSProperties = {
	border: 'unset',
	marginTop: 'unset',
}
