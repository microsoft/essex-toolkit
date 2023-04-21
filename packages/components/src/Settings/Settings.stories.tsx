/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, MessageBar } from '@fluentui/react'
import React, { useCallback, useState } from 'react'

import { Settings } from './Settings.js'
import { ControlType, DataType, type SettingsProps } from './Settings.types.js'

// cover the three basic data types
const basicSettings = {
	title: 'Graph',
	algorithm: 'Louvain',
	nodeLimit: 10000,
	showEdges: true,
	metrics: ['centrality', 'weight'],
}

// wrap the Settings with an onchange
const SettingsComponent: React.FC<SettingsProps> = (props) => {
	const { settings, ...rest } = props
	const [internal, setSettings] = useState(settings)
	const handleChange = useCallback((key: any, value: any) => {
		console.log(`setting changed: '${key}': '${value}'`)
		setSettings((prev: any) => ({
			...prev,
			[`${key}`]: value,
		}))
	}, [])
	console.log('current settings', internal)
	return (
		<div style={{ border: '1px solid orange', padding: 8, marginTop: 8 }}>
			<Settings settings={internal} onChange={handleChange} {...rest} />
		</div>
	)
}

const meta = {
	title: '@essex:components/Settings',
	component: SettingsComponent,
}
export default meta

const BasicSettingsComponent: React.FC = () => {
	return (
		<>
			<MessageBar>
				This example shows a basic object parsed into settings and rendered into
				the default control set.
				<pre>{`
  {
      title: 'Graph',
      algorithm: 'Louvain',
      nodeLimit: 10000,
      showEdges: true
  }
  `}</pre>
			</MessageBar>
			<SettingsComponent settings={basicSettings} />
		</>
	)
}

const AdvancedSettingsComponent: React.FC = () => {
	return (
		<>
			<MessageBar>
				This example shows settings with control types explicitly defined using
				config.
			</MessageBar>
			<SettingsComponent
				settings={basicSettings}
				config={
					{
						title: {
							control: ControlType.Dropdown,
							params: { options: ['None', 'Graph', 'Nodes', 'Edges'] },
						},
						algorithm: {
							control: ControlType.Radio,
							params: { options: ['Louvain', 'Leiden'] },
						},
						nodeLimit: {
							control: ControlType.Slider,
							params: {
								max: 20000,
								step: 1000,
							},
						},
						showEdges: {
							control: ControlType.Checkbox,
						},
					} as any
				}
			/>
		</>
	)
}

const MixedSettingsComponent: React.FC = () => {
	return (
		<>
			<MessageBar>
				This example shows the use of defaultValues for undefined settings, and
				auto-selecting control types based on options. In this example,
				&ldquo;greeting&rdquo; is the only defined setting.
			</MessageBar>
			<SettingsComponent
				settings={{
					greeting: 'Hello and welcome',
				}}
				config={
					{
						fourItemDropdown: {
							defaultValue: 'Nodes',
							params: { options: ['None', 'Graph', 'Nodes', 'Edges'] },
						},
						twoItemRadio: {
							defaultValue: 'Leiden',
							params: { options: ['Louvain', 'Leiden'] },
						},
					} as any
				}
			/>
		</>
	)
}

const DefaultSettingsComponent: React.FC = () => {
	return (
		<>
			<MessageBar>
				This example only uses config with defaultValues and no pre-defined
				settings object.
			</MessageBar>
			<SettingsComponent
				config={
					{
						fourItemDropdown: {
							defaultValue: 'Nodes',
							params: { options: ['None', 'Graph', 'Nodes', 'Edges'] },
						},
						twoItemRadio: {
							defaultValue: 'Leiden',
							params: { options: ['Louvain', 'Leiden'] },
						},
						// empty shows that default of text is displayed
						name: {},
						// just a data type allows an undefined value with a specific type
						age: {
							type: DataType.Number,
						},
						// just a control type
						month: {
							control: ControlType.Slider,
						},
						metrics: {
							type: DataType.Array,
							params: {
								options: ['centrality', 'weight'],
							},
						},
					} as any
				}
			/>
		</>
	)
}
export const BasicSettingsStory = {
	render: () => <BasicSettingsComponent />,
	name: 'Basic Settings',
}

export const AdvancedSettingsStory = {
	render: () => <AdvancedSettingsComponent />,
	name: 'Advanced Settings',
}

export const MixedSettingsStory = {
	render: () => <MixedSettingsComponent />,
	name: 'Mixed set + config values',
}

export const DefaultSettingsStory = {
	render: () => <DefaultSettingsComponent />,
	name: 'Defaults from config only',
}

const GroupedPanel: React.FC = () => {
	return (
		<SettingsComponent
			settings={basicSettings}
			groups={[
				{
					label: 'Rendering',
					keys: ['nodeLimit', 'showEdges'],
				},
				{
					label: 'Communities',
					keys: ['algorithm'],
				},
			]}
		/>
	)
}

const ContextSettingComponent: React.FC = () => {
	const renderPanel = useCallback(
		() => (
			<div style={{ margin: 10 }}>
				<GroupedPanel />
			</div>
		),
		[],
	)
	return (
		<>
			<MessageBar>
				This example shows the settings panel in a dropdown context menu.
			</MessageBar>
			<DefaultButton
				text={'Click for settings'}
				menuProps={{
					items: [
						{
							key: 'dropdown-settings',
							onRender: renderPanel,
						},
					],
				}}
			/>
		</>
	)
}

export const GroupedSettingsStory = {
	render: () => {
		return (
			<>
				<MessageBar>
					This example shows settings within groups, which automatically get a
					separator and optional label. Any ungrouped settings are placed at the
					top (&quot;Title&quot; in this example).
				</MessageBar>
				<GroupedPanel />
			</>
		)
	},

	name: 'Grouped Settings',
}

export const ContextSettingsStory = {
	render: () => <ContextSettingComponent />,
	name: 'Context Menu Settings',
}

export const TextControlStory = {
	name: 'TextControl',
	args: {
		config: {
			textbox: {
				defaultValue: 'text',
			},
			dropdown: {
				defaultValue: 'two',
				params: {
					options: ['one', 'two', 'three', 'four', 'five'],
				},
			},
			radio: {
				defaultValue: 'two',
				params: {
					options: ['one', 'two', 'three'],
				},
			},
		},
	},
}

export const NumberControlStory = {
	name: 'NumberControl',
	args: {
		config: {
			spinner: {
				defaultValue: 1,
			},
			slider: {
				defaultValue: 4,
				control: ControlType.Slider,
				params: {
					min: 1,
					max: 5,
				},
			},
		},
	},
}

export const BooleanControlStory = {
	name: 'BooleanControl',
	args: {
		config: {
			checkbox: {
				defaultValue: true,
				control: ControlType.Checkbox,
			},
			toggle: {
				defaultValue: false,
			},
		},
	},
}

export const ArrayControlStory = {
	name: 'ArrayControl',
	args: {
		config: {
			textbox: {
				defaultValue: ['text'],
			},
			dropdown: {
				defaultValue: ['two'],
				params: {
					options: ['one', 'two', 'three', 'four', 'five'],
				},
			},
			radio: {
				defaultValue: ['two'],
				params: {
					options: ['one', 'two', 'three'],
				},
			},
		},
	},
}
