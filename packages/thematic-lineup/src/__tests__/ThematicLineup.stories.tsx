/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicLineup } from '@essex/thematic-lineup'

const story = {
	title: '@essex:thematic-lineup/ThematicLineup',
}
export default story

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

/**
 * ThematicLineupStory displays a LineUp instance, while also applying default thematic styles and data colors.
 * Use it for a React-style JSX wrapper around LineUp that has more potential flexibility than the very
 * config-limited version exposed by the LineUp project.
 * This allows arbitrary column configs via JSON, and a set of global filters if desired.
 */
export const ThematicLineupStory = () => (
	<div>
		<ThematicLineup data={data} columns={config} width={600} height={300} />
	</div>
)

ThematicLineupStory.story = {
	name: 'main',
}
