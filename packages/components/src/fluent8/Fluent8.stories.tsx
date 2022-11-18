/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ActionButton,
	ChoiceGroup,
	DefaultButton,
	Dropdown,
	IconButton,
	Slider,
	SpinButton,
	Toggle,
} from '@fluentui/react'

import { useButtonProps, useIconButtonProps } from './hooks/button.js'
import { useChoiceGroupProps } from './hooks/choicegroup.js'
import { useDropdownProps } from './hooks/dropdown.js'
import { useSliderProps } from './hooks/slider.js'
import { useSpinButtonProps } from './hooks/spinbutton.js'
import { useToggleProps } from './hooks/toggle.js'

const meta = {
	title: '@essex:components/Fluent8',
}

export default meta

export const Fluent8 = () => {
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
	return (
		<div style={container}>
			<div style={controls}>
				<div style={pair}>
					<div style={label}>
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/button">
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
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/button">
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
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/button">
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
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/spinbutton">
							SpinButton
						</a>
					</div>
					<div style={control}>
						<SpinButton label="Label" {...mediumSpinButtonProps} />
					</div>
					<div style={control}>
						<SpinButton label="Label" {...smallSpinButtonProps} />
					</div>
				</div>

				<div style={pair}>
					<div style={label}>
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/slider">
							Slider
						</a>
					</div>
					<div style={control}>
						<Slider label="Label" {...mediumSliderProps} />
					</div>
					<div style={control}>
						<Slider label="Label" {...smallSliderProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/toggle">
							Toggle
						</a>
					</div>
					<div style={control}>
						<Toggle label="Label" {...mediumToggleProps} />
					</div>
					<div style={control}>
						<Toggle label="Label" {...smallToggleProps} />
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/dropdown">
							Dropdown
						</a>
					</div>
					<div style={control}>
						<Dropdown
							label="Label"
							placeholder={'Placeholder'}
							options={[
								{ key: 'first', text: 'First' },
								{ key: 'second', text: 'Second' },
							]}
							{...mediumDropdownProps}
						/>
					</div>
					<div style={control}>
						<Dropdown
							label="Label"
							placeholder={'Placeholder'}
							options={[
								{ key: 'first', text: 'First' },
								{ key: 'second', text: 'Second' },
							]}
							{...smallDropdownProps}
						/>
					</div>
				</div>
				<div style={pair}>
					<div style={label}>
						<a href="https://developer.microsoft.com/en-us/fluentui#/controls/web/choicegroup">
							ChoiceGroup
						</a>
					</div>
					<div style={control}>
						<ChoiceGroup
							label="Label"
							selectedKey={'first'}
							{...mediumChoiceGroupProps}
						/>
					</div>
					<div style={control}>
						<ChoiceGroup
							label="Label"
							selectedKey={'first'}
							{...smallChoiceGroupProps}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

const container = {}

const controls = {
	display: 'flex',
	gap: 12,
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
