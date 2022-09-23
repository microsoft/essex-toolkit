/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useCallback, useState } from 'react'

import type { EnumButtonBarProps } from './EnumButtonBar.js'
import { EnumButtonBar as EnumButtonBarComponent } from './EnumButtonBar.js'

const storyMetadata = {
	title: '@essex:components/EnumButtonBar',
	component: EnumButtonBarComponent,
}
export default storyMetadata

enum Stuff {
	First = 'first',
	Second = 'second',
	Another = 'another',
	CamelCase = 'camelcase',
}

const Template = (args: EnumButtonBarProps<Stuff>) => {
	const theme = useTheme()
	const [selected, setSelected] = useState<Stuff | undefined>(Stuff.First)
	const onChange = useCallback(opt => setSelected(opt), [setSelected])
	console.log(selected)
	return (
		<EnumButtonBarComponent
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

export const EnumButtonBar = Template.bind({}) as any as {
	args: EnumButtonBarProps<Stuff>
}

EnumButtonBar.args = {
	enumeration: Stuff,
	iconOnly: true,
	iconNames: ['Document', 'Database', 'LightningBolt', 'Code'],
}
