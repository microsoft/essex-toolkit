/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITextFieldProps } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'

import { ReadOnlyTextField } from './ReadOnlyTextField.js'

const meta = {
	title: '@essex:components/ReadOnlyTextField',
	component: ReadOnlyTextField,
	args: {
		value: 'Read only text',
	},
}
export default meta

const Template: ComponentStory<typeof ReadOnlyTextField> = (
	args: ITextFieldProps,
) => <ReadOnlyTextField {...args} />

export const Primary = Template.bind({})
Primary.storyName = 'ReadOnlyTextField'
