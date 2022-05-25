/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { Header } from './Header.js'

export default {
	title: 'Example/Header',
	component: Header,
	parameters: {
		// More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = args => <Header {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
	user: {
		name: 'Jane Doe',
	},
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
