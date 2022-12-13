/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'
import { useCallback, useState } from 'react'

import type { NumberSpinButtonProps } from './NumberSpinButton.js'
import { NumberSpinButton } from './NumberSpinButton.js'

const meta = {
	title: '@essex:components/NumberSpinButton',
	component: NumberSpinButton,
	args: {
		label: 'Label',
		max: 20,
	},
}
export default meta

const Template: ComponentStory<typeof NumberSpinButton> = (
	args: NumberSpinButtonProps,
) => {
	const [value, setValue] = useState(10)
	const handleChange = useCallback(n => setValue(n), [setValue])
	return <NumberSpinButton {...args} value={value} onChange={handleChange} />
}

export const Primary = Template.bind({})
Primary.storyName = 'NumberSpinButton'