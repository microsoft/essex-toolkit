/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { ClippedGraphProps } from './ClippedGraph.js'
import { ClippedGraph } from './ClippedGraph.js'

const meta = {
	title: '@essex:components/ClippedGraph',
	component: ClippedGraph,
	args: {
		width: 800,
		height: 100,
		data: [
			1, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 5, 4, 5, 6, 5, 6, 5, 4, 3, 4, 3, 2,
			25, 89, 30, 12, 3, 2, 3, 4, 3, 6, 7, 8, 7, 8, 7, 8, 7, 8, 9, 8, 9, 8, 7,
			6, 7, 6, 5, 6,
		],
	},
}

export default meta

const Template: ComponentStory<typeof ClippedGraph> = (
	args: ClippedGraphProps,
) => <ClippedGraph {...args} />

export const Primary = Template.bind({})

export const ClippedGradient = Template.bind({})
ClippedGradient.args = {
	clipped: true,
	gradient: true,
}

export const ClippedHorizon = Template.bind({})
ClippedHorizon.args = {
	clipped: true,
	horizon: true,
}
