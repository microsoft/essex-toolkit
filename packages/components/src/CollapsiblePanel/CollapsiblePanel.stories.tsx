/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import { useCallback, useState } from 'react'

import { CollapsiblePanel } from './CollapsiblePanel.js'
import type { CollapsiblePanelProps } from './CollapsiblePanel.types.js'
import { CollapsiblePanelContainer } from './CollapsiblePanelContainer.js'

const meta = {
	title: '@essex:components/CollapsiblePanel',
	component: CollapsiblePanel,
	args: {
		title: 'Header title',
	},
}

export default meta

const Lorem = () => (
	<div
		style={{
			padding: 4,
			width: '100%',
		}}
	>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
		non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	</div>
)

const Template: ComponentStory<typeof CollapsiblePanel> = (
	args: CollapsiblePanelProps,
) => {
	return (
		<CollapsiblePanel {...args}>
			<Lorem />
		</CollapsiblePanel>
	)
}

export const Primary = Template.bind({})

export const Customized = Template.bind({})
Customized.args = {
	defaultExpanded: true,
	styles: {
		root: {
			width: 300,
		},
		header: {
			backgroundColor: 'azure',
			padding: '0.5rem',
			textTransform: 'uppercase' as const,
			fontWeight: 500,
			fontSize: ' 1.5rem',
		},
		title: {
			fontFamily: 'monospace',
		},
		content: {
			border: 'none',
			backgroundColor: 'purple',
			color: 'white',
			padding: 10,
			borderRadius: '0 0 0.5rem 0.5rem',
		},
	},
	buttonProps: {
		iconProps: {
			iconName: 'RedEye',
			styles: {
				root: {
					color: 'orange',
				},
			},
		},
	},
	duration: 2000,
}

export const Header = Template.bind({})
Header.args = {
	onRenderHeader: () => (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
			}}
		>
			<div>Header</div>
			<Toggle
				styles={{ root: { margin: 0 } }}
				onClick={e => e.stopPropagation()}
			/>
		</div>
	),
}
Header.storyName = 'Custom onRenderHeader'

export const IconClick = Template.bind({})
IconClick.args = {
	onHeaderClick: () => alert('header clicked'),
}
IconClick.storyName = 'Icon/header separate click'

export const Controlled: ComponentStory<typeof CollapsiblePanel> = (
	args: CollapsiblePanelProps,
) => {
	const [expanded, setExpanded] = useState<boolean>(false)
	const onHeaderClick = useCallback(
		() => setExpanded(prev => !prev),
		[setExpanded],
	)
	return (
		<CollapsiblePanel {...args} expanded={expanded} onIconClick={onHeaderClick}>
			<Lorem />
		</CollapsiblePanel>
	)
}
Controlled.storyName = 'Controlled expand/collapse'

export const NoIcon = Template.bind({})
NoIcon.args = {
	hideIcon: true,
}

export const CollapsiblePanelContainerStory = () => {
	return (
		<CollapsiblePanelContainer>
			<CollapsiblePanel title="First">
				<Lorem />
			</CollapsiblePanel>
			<CollapsiblePanel title="Second">
				<Lorem />
			</CollapsiblePanel>
		</CollapsiblePanelContainer>
	)
}

CollapsiblePanelContainerStory.storyName = 'Container with multiple children'
