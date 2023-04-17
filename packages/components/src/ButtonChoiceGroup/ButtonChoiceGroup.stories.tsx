/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'

import { ButtonChoiceGroup } from './ButtonChoiceGroup.js'

const meta = {
	title: '@essex:components/ButtonChoiceGroup',
	component: ButtonChoiceGroup,
	args: {
		options: [
			{
				key: '1',
				text: 'Option 1',
			},
			{
				key: '2',
				text: 'Option 2',
			},
			{
				key: '3',
				text: 'Option 3',
			},
			{
				key: '4',
				text: 'Icon option',
				title: 'button title',
				iconProps: { iconName: 'Save' },
			},
			{
				key: '5',
				text: '',
				title: 'icon only',
				iconProps: { iconName: 'History' },
			},
		],
	},
	onChange: (
		_?: React.FormEvent<HTMLElement | HTMLInputElement>,
		opt?: IChoiceGroupOption,
	) => console.log(`option: ${opt?.key}`),
}

export default meta

export const Primary = {}

export const Customized = {
	args: {
		styles: {
			root: {
				border: '1px solid orange',
				padding: 8,
			},
			flexContainer: {
				border: '1px solid dodgerblue',
			},
		},
	},
}
