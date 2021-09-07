/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Settings } from '@essex-js-toolkit/themed-components'
import { MessageBar, DefaultButton } from '@fluentui/react'
import { useCallback, useState } from 'react'

import { CSF } from './types'

const story = {
	title: 'Settings Pane',
}
export default story

// cover the three basic data types
const basicSettings = {
	title: 'Graph',
	algorithm: 'Louvain',
	nodeLimit: 10000,
	showEdges: true,
}

/**
 * BasicSettingsStory is a zero-config settings panel that simply parses a supplied object
 * and generates a list of Fluent UI controls based on the data types.
 * Shows a basic object parsed into settings and rendered into
 * the default control set
 */
export const BasicSettingsStory: CSF = () => {
	const [settings, setSettings] = useState(basicSettings)
	const handleChange = useCallback(
		(key, value) => {
			const changed = {
				...settings,
				[`${key}`]: value,
			}
			setSettings(changed)
		},
		[settings],
	)
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
			<Settings settings={settings} onChange={handleChange} />
		</>
	)
}

BasicSettingsStory.story = {
	name: 'Basic Settings',
}

/**
 * AdvancedSettingsStory is a zero-config settings panel that simply parses a supplied object
 * and generates a list of Fluent UI controls based on the data types.
 * Shows a dynamic object parsed into settings and rendered into
 * the default control set
 */
export const AdvancedSettingsStory: CSF = () => {
	const [settings, setSettings] = useState(basicSettings)
	const handleChange = useCallback(
		(key, value) => {
			const changed = {
				...settings,
				[`${key}`]: value,
			}
			setSettings(changed)
		},
		[settings],
	)
	return (
		<Settings
			settings={settings}
			config={
				{
					title: {
						control: 'dropdown',
						params: { options: ['None', 'Graph', 'Nodes', 'Edges'] },
					},
					algorithm: {
						control: 'radio',
						params: { options: ['Louvain', 'Leiden'] },
					},
					nodeLimit: {
						control: 'slider',
						params: {
							max: 20000,
							step: 1000,
						},
					},
					showEdges: {
						control: 'checkbox',
					},
				} as any
			}
			onChange={handleChange}
		/>
	)
}

AdvancedSettingsStory.story = {
	name: 'Advanced Settings',
}

const GroupedPanel = () => {
	const [settings, setSettings] = useState(basicSettings)
	const handleChange = useCallback(
		(key, value) => {
			const changed = {
				...settings,
				[`${key}`]: value,
			}
			setSettings(changed)
		},
		[settings],
	)
	return (
		<Settings
			settings={settings}
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
			onChange={handleChange}
		/>
	)
}

/**
 * GroupedSettingsStory shows settings within groups, which automatically get a
 * separator and optional label
 */
export const GroupedSettingsStory: CSF = () => {
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
}

GroupedSettingsStory.story = {
	name: 'Grouped Settings',
}

/**
 * ContextSettingsStory shows the settings panel in a dropdown context menu.
 */
export const ContextSettingsStory: CSF = () => {
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

ContextSettingsStory.story = {
	name: 'Context Menu Settings',
}
