/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react'

import type { SparklineProps } from '../Sparkline.js'
import { Sparkline } from '../Sparkline.js'

const meta = {
	title: '@essex:charts-react/Sparkline',
	component: Sparkline,
	args: {
		width: 150,
		height: 30,
		data: [1, 2, 1.5, 4, 5, 4, 7],
	},
}
export default meta

export const Primary = {
	name: 'Sparkline',
}
