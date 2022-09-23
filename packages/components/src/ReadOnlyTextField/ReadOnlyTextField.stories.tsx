/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITextFieldProps } from '@fluentui/react'

import { ReadOnlyTextField as ReadOnlyTextFieldComponent } from './ReadOnlyTextField.js'

const storyMetadata = {
	title: '@essex:components/ReadOnlyTextField',
	component: ReadOnlyTextFieldComponent,
}
export default storyMetadata

const Template = (args: ITextFieldProps) => (
	<ReadOnlyTextFieldComponent {...args} />
)

export const ReadOnlyTextField = Template.bind({}) as any as {
	args: ITextFieldProps
}

ReadOnlyTextField.args = {
	value: 'Read only text',
}
