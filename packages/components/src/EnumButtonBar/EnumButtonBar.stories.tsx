/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import { useCallback, useState } from 'react'

import type { EnumButtonBarProps } from './EnumButtonBar.js'
import { EnumButtonBar } from './EnumButtonBar.js'

const meta = {
	title: '@essex:components/EnumButtonBar',
	component: EnumButtonBar,
}
export default meta

enum Stuff {
	First = 'first',
	Second = 'second',
	Another = 'another',
	CamelCase = 'camelcase',
}

const Template: ComponentStory<typeof EnumButtonBar<Stuff>> = (
	args: EnumButtonBarProps<Stuff>,
) => {
	const theme = useTheme()
	const [selected, setSelected] = useState<Stuff | undefined>(Stuff.First)
	const onChange = useCallback(opt => setSelected(opt), [setSelected])
	console.log(selected)
	return (
		<EnumButtonBar
			{...args}
			onChange={onChange}
			styles={{
				root: {
					border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
					padding: 0,
				},
			}}
			selected={selected}
		/>
	)
}

export const Primary = Template.bind({})

Primary.args = {
	enumeration: Stuff,
	iconOnly: true,
	iconNames: ['Document', 'Database', 'LightningBolt', 'Code'],
}
Primary.storyName = 'EnumButtonBar'
