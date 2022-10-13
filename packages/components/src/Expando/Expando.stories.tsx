/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Expando as ExpandoComponent } from './Expando.js'
import type { ExpandoProps } from './Expando.types.js'

const storyMetadata = {
	title: '@essex:components/Expando',
	component: ExpandoComponent,
}
export default storyMetadata

const Template = (args: ExpandoProps) => (
	<ExpandoComponent {...args}>Here is the child content!</ExpandoComponent>
)

export const Primary = Template.bind({}) as any as { args: ExpandoProps }

Primary.args = {
	label: 'More...',
	defaultExpanded: false,
}

export const Customized = Template.bind({}) as any as { args: ExpandoProps }

Customized.args = {
	label: 'More...',
	defaultExpanded: false,
	styles: {
		root: {
			border: '1px solid orange',
			background: 'azure',
		},
		content: {
			background: 'coral',
			padding: 8,
		},
	},
	iconButtonProps: {
		iconProps: {
			iconName: 'RedEye',
			styles: {
				root: {
					fontSize: 12,
				},
			},
		},
	},
	linkProps: {
		styles: {
			root: {
				color: 'cornflowerblue',
			},
		},
	},
}
