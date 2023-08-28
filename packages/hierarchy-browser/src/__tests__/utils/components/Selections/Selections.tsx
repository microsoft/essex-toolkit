/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import './Style.css'

import type { IButtonStyles, IChoiceGroupOption } from '@fluentui/react'
import { ChoiceGroup, Toggle } from '@fluentui/react'
import { memo, useCallback } from 'react'
interface ISelections {
	options: IChoiceGroupOption[]
	defaultSelectedKey: string
	onChange: (option: IChoiceGroupOption) => void
	label: string
}

const styles = { flexContainer: { display: 'inline-flex' } }

export const Selections: React.FC<ISelections> = memo(function Selections({
	options,
	defaultSelectedKey,
	onChange,
	label,
}: ISelections) {
	const _onChange = useCallback(
		(
			ev: React.FormEvent<HTMLInputElement | HTMLElement> | undefined,
			option: IChoiceGroupOption | undefined,
		): void => {
			if (option) {
				onChange(option)
			}
		},
		[onChange],
	)
	return (
		<ChoiceGroup
			styles={styles}
			defaultSelectedKey={defaultSelectedKey}
			options={options}
			onChange={_onChange}
			label={label}
			required={true}
			className='hierarchy-choice-group'
		/>
	)
})
const style: React.CSSProperties = { display: 'inline-flex' }
const ToggleBaseStyle = { container: { margin: '10px' } } as IButtonStyles
const ToggleAugmentStyle = {
	container: { margin: '10px' },
	root: { marginLeft: '20px' },
} as IButtonStyles
interface IControlGroup {
	options: IChoiceGroupOption[]
	defaultSelectedKey: number
	onChange: (option: IChoiceGroupOption) => void
	handleNeighborsLoaded: (
		ev: React.MouseEvent<HTMLElement, MouseEvent>,
		checked?: boolean,
	) => void
	loadState?: boolean
	showCustomStyles?: boolean
	onStyleChange: (
		ev: React.MouseEvent<HTMLElement, MouseEvent>,
		checked?: boolean,
	) => void
}
export const ControlGroup: React.FC<IControlGroup> = memo(
	function ControlGroup({
		loadState,
		defaultSelectedKey,
		onChange,
		options,
		handleNeighborsLoaded,
		showCustomStyles,
		onStyleChange,
	}: IControlGroup) {
		return (
			<div style={style}>
				<Selections
					options={options}
					defaultSelectedKey={`${defaultSelectedKey}`}
					label={'selected community'}
					onChange={onChange}
				/>
				<Toggle
					label='neighbors loaded'
					checked={loadState}
					onChange={handleNeighborsLoaded}
					styles={ToggleBaseStyle}
				/>
				<Toggle
					label='custom styles'
					checked={showCustomStyles}
					onChange={onStyleChange}
					styles={ToggleAugmentStyle}
				/>
			</div>
		)
	},
)
