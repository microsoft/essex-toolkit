/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react'

import { EnumDropdown } from './EnumDropdown.js'
import type { EnumDropdownProps } from './EnumDropdown.types.js'

enum Stuff {
	First = 'one',
	Second = 'two',
	Another = 'three',
	CamelCase = 'camelcase',
}

const meta = {
	title: '@essex:components/EnumDropdown',
	component: EnumDropdown,
	args: {
		enumeration: Stuff,
	},
}
export default meta

export const Primary = {
	name: 'EnumDropdown',
}
