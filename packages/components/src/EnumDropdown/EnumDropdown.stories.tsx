/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EnumDropdown as EnumDropdownComponent } from './EnumDropdown.js'
import type { EnumDropdownProps } from './EnumDropdown.types.js'

const storyMetadata = {
	title: '@essex:components/EnumDropdown',
	component: EnumDropdownComponent,
}
export default storyMetadata

enum Stuff {
	First = 'one',
	Second = 'two',
	Another = 'three',
	CamelCase = 'camelcase',
}

const Template = (args: EnumDropdownProps) => (
	<EnumDropdownComponent {...args} />
)

export const EnumDropdown = Template.bind({}) as any as {
	args: EnumDropdownProps
}

EnumDropdown.args = {
	enumeration: Stuff,
}
