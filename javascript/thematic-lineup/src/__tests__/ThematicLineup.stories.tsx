/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicLineup } from '@essex/thematic-lineup'

const meta = {
	title: '@essex:thematic-lineup/ThematicLineup',
}
export default meta

const data = [
	{
		name: 'Joe',
		age: 32,
		money: 120,
	},
	{
		name: 'Bob',
		age: 41,
		money: 3000,
	},
	{
		name: 'Jane',
		age: 44,
		money: 600,
	},
	{
		name: 'Larry',
		age: 8,
		money: 45,
	},
	{
		name: 'Lisa',
		age: 9,
		money: 12,
	},
]

const config = [
	{
		name: 'name',
		type: 'string',
	},
	{
		name: 'age',
		type: 'number',
	},
	{
		name: 'money',
		type: 'number',
	},
]

export const ThematicLineupStory = {
	render: () => (
		<ThematicLineup data={data} columns={config} width={600} height={300} />
	),

	name: 'ThematicLineup',
}
