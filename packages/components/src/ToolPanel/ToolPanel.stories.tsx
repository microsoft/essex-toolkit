/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ToolPanel } from './ToolPanel.js'
import type { ToolPanelProps } from './ToolPanel.types.js'

const meta = {
	title: '@essex:components/ToolPanel',
	component: ToolPanel,
}
export default meta

const Template = (args: ToolPanelProps) => {
	return (
		<div
			style={{
				width: 300,
				height: 600,
				border: '1px solid orange',
			}}
		>
			<ToolPanel {...args}>
				{new Array(10).fill({}).map((a, i) => (
					<div
						key={`item-${i}`}
						style={{
							height: 100,
							border: '1px solid #bbb',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							background: i % 2 === 0 ? '#e3e3e3' : '#efefef',
						}}
					>
						{`item ${i}`}
					</div>
				))}
			</ToolPanel>
		</div>
	)
}

export const Primary = Template.bind({}) as any as { args: ToolPanelProps }

Primary.args = {
	headerText: 'Standard ToolPanel',
}

export const WithIcon = Template.bind({}) as any as { args: ToolPanelProps }

WithIcon.args = {
	headerText: 'Settings',
	headerIconProps: {
		iconName: 'Settings',
	},
}

export const Customized = Template.bind({}) as any as { args: ToolPanelProps }

Customized.args = {
	headerText: 'Hello',
	headerIconProps: {
		iconName: 'History',
		styles: {
			root: {
				color: 'white',
			},
		},
	},
	hasCloseButton: false,
	styles: {
		root: {
			background: 'aliceblue',
		},
		header: {
			background: 'dodgerblue',
			height: 56,
		},
		title: {
			color: 'bisque',
		},
	},
}
