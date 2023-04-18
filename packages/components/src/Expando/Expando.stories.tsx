/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Expando } from './Expando.js'
import type { ExpandoProps } from './Expando.types.js'
import React from 'react'

const StoryComponent: React.FC<ExpandoProps> = (args) => {
	return <Expando {...args}>Here is the child content!</Expando>
}

const meta = {
	title: '@essex:components/Expando',
	component: StoryComponent,
	args: {
		label: 'More...',
		defaultExpanded: false,
	},
}
export default meta

export const Primary = {}

export const Customized = {
	args: {
		styles: {
			root: {
				border: '1px solid orange',
				background: 'aliceblue',
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
					color: 'dodgerblue',
				},
			},
		},
	},
}
