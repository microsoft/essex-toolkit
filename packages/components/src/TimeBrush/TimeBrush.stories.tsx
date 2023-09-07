/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TimeBrushProps } from './TimeBrush.js'
import { TimeBrush } from './TimeBrush.js'

const meta = {
	title: '@essex:components/TimeBrush',
	component: TimeBrush,
}
export default meta

const PrimaryComponent: React.FC<TimeBrushProps> = (args) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center'}}>
			<TimeBrush
				{...args}
				search={""}
			/>
		</div>
	)
}

export const Primary = {
	render: (args: TimeBrushProps) => <PrimaryComponent {...args} />,
	args: {
		width: 700,
		height: 25,
		dateRange: [new Date("2019-12-15T00:00:00.000Z"), new Date("2020-06-08T00:00:00.000Z")]
	},
}

