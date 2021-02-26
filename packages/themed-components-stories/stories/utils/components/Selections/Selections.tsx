import React, { memo, useCallback } from 'react'
import {
	ChoiceGroup,
	IChoiceGroupOption,
	Toggle,
	IButtonStyles,
} from '@fluentui/react'

import './Style.css'
interface Selections {
	options: IChoiceGroupOption[]
	defaultSelectedKey: string
	onChange: (option: IChoiceGroupOption) => void
	label: string
}

const styles = { flexContainer: { display: 'inline-flex' } }

export const Selections: React.FC<Selections> = memo(function Selections({
	options,
	defaultSelectedKey,
	onChange,
	label,
}: Selections) {
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
		/>
	)
})
const style: React.CSSProperties = { display: 'inline-flex' }
const ToggleBaseStyle = { container: { margin: '10px' } } as IButtonStyles
const ToggleAugmentStyle = {
	container: { margin: '10px' },
	root: { marginLeft: '20px' },
} as IButtonStyles
interface ControlGroup {
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
export const ControlGroup: React.FC<ControlGroup> = memo(function ControlGroup({
	loadState,
	defaultSelectedKey,
	onChange,
	options,
	handleNeighborsLoaded,
	showCustomStyles,
	onStyleChange,
}: ControlGroup) {
	return (
		<div style={style}>
			<Selections
				options={options}
				defaultSelectedKey={`${defaultSelectedKey}`}
				label={'selected community'}
				onChange={onChange}
			/>
			<Toggle
				label="neighbors loaded"
				checked={loadState}
				onChange={handleNeighborsLoaded}
				styles={ToggleBaseStyle}
			/>
			<Toggle
				label="custom styles"
				checked={showCustomStyles}
				onChange={onStyleChange}
				styles={ToggleAugmentStyle}
			/>
		</div>
	)
})
