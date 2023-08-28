/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { INavProps } from '@fluentui/react'
import {
	ActionButton,
	Checkbox,
	ChoiceGroup,
	ColorPicker,
	DefaultButton,
	Dropdown,
	DropdownMenuItemType,
	IconButton,
	Label,
	Nav,
	Pivot,
	PivotItem,
	Slider,
	SpinButton,
	TextField,
	Toggle,
} from '@fluentui/react'

import { useButtonProps, useIconButtonProps } from './button.js'
import { useCheckboxProps } from './checkbox.js'
import { useChoiceGroupProps } from './choicegroup.js'
import { useColorPickerProps } from './colorpicker.js'
import { useDropdownProps } from './dropdown.js'
import { useLabelProps } from './label.js'
import { useNavProps } from './nav.js'
import { usePivotProps } from './pivot.js'
import { useSliderProps } from './slider.js'
import { useSpinButtonProps } from './spinbutton.js'
import { useTextFieldProps } from './textfield.js'
import { useToggleProps } from './toggle.js'

const meta = {
	title: '@essex:components/Fluent8',
}

export default meta

export const Fluent8 = () => {
	const mediumLabelProps = useLabelProps({})
	const smallLabelProps = useLabelProps({}, 'small')
	const mediumTextFieldProps = useTextFieldProps({})
	const smallTextFieldProps = useTextFieldProps({}, 'small')
	const mediumButtonProps = useButtonProps({})
	const smallButtonProps = useButtonProps({}, 'small')
	const mediumIconButtonProps = useIconButtonProps({
		iconProps: {
			iconName: 'Calendar',
		},
	})
	const smallIconButtonProps = useIconButtonProps(
		{
			iconProps: {
				iconName: 'Calendar',
			},
		},
		'small',
	)
	const mediumIconButtonMenuProps = useIconButtonProps({
		iconProps: {
			iconName: 'Calendar',
		},
		menuProps: {
			items: [
				{
					key: 'first',
					text: 'First',
				},
				{
					key: 'second',
					text: 'Second',
				},
			],
		},
	})
	const smallIconButtonMenuProps = useIconButtonProps(
		{
			iconProps: {
				iconName: 'Calendar',
			},
			menuProps: {
				items: [
					{
						key: 'first',
						text: 'First',
					},
					{
						key: 'second',
						text: 'Second',
					},
				],
			},
		},
		'small',
	)
	const mediumActionButtonProps = useButtonProps({
		iconProps: {
			iconName: 'Add',
		},
	})
	const smallActionButtonProps = useButtonProps(
		{
			iconProps: {
				iconName: 'Add',
			},
		},
		'small',
	)
	const mediumSpinButtonProps = useSpinButtonProps({})
	const smallSpinButtonProps = useSpinButtonProps({}, 'small')
	const mediumSliderProps = useSliderProps({})
	const smallSliderProps = useSliderProps({}, 'small')
	const mediumToggleProps = useToggleProps({})
	const smallToggleProps = useToggleProps({}, 'small')
	const mediumCheckboxProps = useCheckboxProps({})
	const smallCheckboxProps = useCheckboxProps({}, 'small')
	const mediumDropdownProps = useDropdownProps({})
	const smallDropdownProps = useDropdownProps({}, 'small')
	const mediumChoiceGroupProps = useChoiceGroupProps({
		options: [
			{ key: 'first', text: 'First' },
			{ key: 'second', text: 'Second' },
		],
	})
	const smallChoiceGroupProps = useChoiceGroupProps(
		{
			options: [
				{ key: 'first', text: 'First' },
				{ key: 'second', text: 'Second' },
			],
		},
		'small',
	)
	const mediumColorPickerProps = useColorPickerProps({})
	const smallColorPickerProps = useColorPickerProps({}, 'small')
	const mediumPivotProps = usePivotProps({})
	const smallPivotProps = usePivotProps({}, 'small')
	const mediumNavProps = useNavProps({})
	const smallNavProps = useNavProps({}, 'small')
	return (
		<div style={container}>
			<div style={controls}>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/label'>
							Label
						</a>
					</div>
					<div style={control}>
						<Label {...mediumLabelProps}>Label</Label>
					</div>
					<div style={control}>
						<Label {...smallLabelProps}>Label</Label>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/textfield'>
							TextField
						</a>
					</div>
					<div style={control}>
						<TextField
							label={'Label'}
							{...mediumTextFieldProps}
							defaultValue={'Text content'}
							placeholder={'Enter text'}
						/>
					</div>
					<div style={control}>
						<TextField
							label={'Label'}
							{...smallTextFieldProps}
							defaultValue={'Text content'}
							placeholder={'Enter text'}
						/>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/button'>
							DefaultButton
						</a>
					</div>
					<div style={control}>
						<DefaultButton {...mediumButtonProps}>Label</DefaultButton>
					</div>
					<div style={control}>
						<DefaultButton {...smallButtonProps}>Label</DefaultButton>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/button'>
							IconButton
						</a>
					</div>
					<div style={control}>
						<IconButton {...mediumIconButtonProps} />
					</div>
					<div style={control}>
						<IconButton {...smallIconButtonProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/button'>
							IconButton with menuProps
						</a>
					</div>
					<div style={control}>
						<IconButton {...mediumIconButtonMenuProps} />
					</div>
					<div style={control}>
						<IconButton {...smallIconButtonMenuProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/button'>
							ActionButton
						</a>
					</div>
					<div style={control}>
						<ActionButton {...mediumActionButtonProps}>
							Create item
						</ActionButton>
					</div>
					<div style={control}>
						<ActionButton {...smallActionButtonProps}>Create item</ActionButton>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/spinbutton'>
							SpinButton
						</a>
					</div>
					<div style={control}>
						<SpinButton label='Label' {...mediumSpinButtonProps} />
					</div>
					<div style={control}>
						<SpinButton label='Label' {...smallSpinButtonProps} />
					</div>
				</div>

				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/slider'>
							Slider
						</a>
					</div>
					<div style={control}>
						<Slider label='Label' {...mediumSliderProps} />
					</div>
					<div style={control}>
						<Slider label='Label' {...smallSliderProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/toggle'>
							Toggle
						</a>
					</div>
					<div style={control}>
						<Toggle label='Label' {...mediumToggleProps} />
					</div>
					<div style={control}>
						<Toggle label='Label' {...smallToggleProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/checkbox'>
							Checkbox
						</a>
					</div>
					<div style={control}>
						<Checkbox label='Label' {...mediumCheckboxProps} />
					</div>
					<div style={control}>
						<Checkbox label='Label' {...smallCheckboxProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/dropdown'>
							Dropdown
						</a>
					</div>
					<div style={control}>
						<Dropdown
							label='Label'
							placeholder={'Placeholder'}
							options={[
								{
									key: 'header1',
									text: 'First section',
									itemType: DropdownMenuItemType.Header,
								},
								{ key: 'first', text: 'First' },
								{ key: 'second', text: 'Second' },
								{
									key: 'divider',
									text: '-',
									itemType: DropdownMenuItemType.Divider,
								},
								{ key: 'third', text: 'Third' },
								{
									key: 'header2',
									text: 'New section',
									itemType: DropdownMenuItemType.Header,
								},
								{ key: 'fourth', text: 'Fourth' },
							]}
							{...mediumDropdownProps}
						/>
					</div>
					<div style={control}>
						<Dropdown
							label='Label'
							placeholder={'Placeholder'}
							options={[
								{
									key: 'header1',
									text: 'First section',
									itemType: DropdownMenuItemType.Header,
								},
								{ key: 'first', text: 'First' },
								{ key: 'second', text: 'Second' },
								{
									key: 'divider',
									text: '-',
									itemType: DropdownMenuItemType.Divider,
								},
								{ key: 'third', text: 'Third' },
								{
									key: 'header2',
									text: 'New section',
									itemType: DropdownMenuItemType.Header,
								},
								{ key: 'fourth', text: 'Fourth' },
							]}
							{...smallDropdownProps}
						/>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/choicegroup'>
							ChoiceGroup
						</a>
					</div>
					<div style={control}>
						<ChoiceGroup
							label='Label'
							selectedKey={'first'}
							{...mediumChoiceGroupProps}
						/>
					</div>
					<div style={control}>
						<ChoiceGroup
							label='Label'
							selectedKey={'first'}
							{...smallChoiceGroupProps}
						/>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/colorpicker'>
							ColorPicker
						</a>
					</div>
					<div style={sideby}>
						<div style={colorpicker}>
							<ColorPicker color={'dodgerblue'} {...mediumColorPickerProps} />
						</div>
						<div style={colorpickersmall}>
							<ColorPicker color={'dodgerblue'} {...smallColorPickerProps} />
						</div>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/pivot'>
							Pivot
						</a>
					</div>
					<div style={control}>
						<Pivot {...mediumPivotProps}>
							<PivotItem headerText={'Tab 1'} />
							<PivotItem headerText={'Tab 2'} />
						</Pivot>
					</div>
					<div style={control}>
						<Pivot {...smallPivotProps}>
							<PivotItem headerText={'Tab 1'} />
							<PivotItem headerText={'Tab 2'} />
						</Pivot>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href='https://developer.microsoft.com/en-us/fluentui#/controls/web/nav'>
							Nav
						</a>
					</div>
					<div style={sideby}>
						<div style={control}>
							<Nav {...navProps} {...mediumNavProps} />
						</div>
						<div style={control}>
							<Nav {...navProps} {...smallNavProps} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const navProps: INavProps = {
	groups: [
		{
			name: 'Group 1',
			links: [
				{
					name: 'Link 1',
					url: '#link1',
					links: [
						{
							name: 'Link 1.1',
							url: '#link1.1',
							links: [
								{
									name: 'Link 1.1.1',
									url: '#link1.1.1',
								},
								{
									name: 'Link 1.1.2',
									url: '#link1.1.2',
								},
							],
						},
						{
							name: 'Link 1.2',
							url: '#link1.2',
						},
					],
				},
			],
		},
		{
			name: 'Group 2',
			links: [
				{
					name: 'Link 2',
					url: '#link2',
					links: [
						{
							name: 'Link 2.1',
							url: '#link2.1',
						},
						{
							name: 'Link 2.2',
							url: '#link2.2',
						},
					],
				},
			],
		},
	],
}

const container = {}

const controls = {
	display: 'flex',
	gap: 20,
	flexWrap: 'wrap' as const,
}

const pair = {
	display: 'flex',
	flexDirection: 'column' as const,
	gap: 8,
}

const label = {}

const control = {
	width: 200,
	height: 100,
}

const sideby = {
	display: 'flex',
	flexDirection: 'row' as const,
	gap: 8,
}

const colorpicker = {
	width: 300,
	height: 400,
}
const colorpickersmall = {
	width: 200,
	height: 300,
}
