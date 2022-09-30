/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ChoiceGroup,
	DefaultButton,
	IChoiceGroupOption,
	IChoiceGroupOptionProps,
	IChoiceGroupProps,
	IconButton,
	useTheme,
} from '@fluentui/react'
import { memo, useMemo } from 'react'

export const ButtonChoiceGroup: React.FC<IChoiceGroupProps> = memo(
	function ButtonChoiceGroup({ options, ...props }) {
		const theme = useTheme()
		const choiceGroupStyles = useMemo(
			() => ({
				flexContainer: {
					display: 'inline-flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					borderRadius: '2px',
					border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
			}),
			[theme],
		)

		const buttonOptions = useMemo(
			(): IChoiceGroupOption[] | undefined =>
				options?.map(o => {
					return {
						...o,
						styles: {
							...o.styles,
							root: {
								margin: 'unset',
								borderRadius: '2px',
							},
						},
						onRenderField,
					} as IChoiceGroupOption
				}),
			[options],
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

	return iconOnly ? (
		<IconButton
			title={props?.title}
			iconProps={props?.iconProps}
			checked={props?.checked}
			toggle
			onClick={() => props?.onChange?.(undefined, props)}
		/>
	) : (
		<DefaultButton
			style={DefaultButtonStyle}
			title={props?.title}
			iconProps={props?.iconProps}
			checked={props?.checked}
			toggle
			onClick={() => props?.onChange?.(undefined, props)}
		>
			{props?.text}
		</DefaultButton>
	)
}

const DefaultButtonStyle: React.CSSProperties = {
	border: 'unset',
	marginTop: 'unset',
}
