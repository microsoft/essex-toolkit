/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IChoiceGroupOption } from '@fluentui/react'
import { ButtonChoiceGroup } from '../index.js'

const meta = {
	title: '@essex:themed-components/Button Choice Group',
}

export default meta

const options = [
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
]
/**
 * Button Choice Group is a ChoiceGroup component based on
 * Fluent adapted for Thematic styling with Button appearance
 */
export const ButtonChoiceGroupStory = () => {
	return (
		<ButtonChoiceGroup
			options={options}
			onChange={(
				_?: React.FormEvent<HTMLElement | HTMLInputElement>,
				opt?: IChoiceGroupOption,
			) => console.log('option:', opt?.key)}
		/>
	)
}
ButtonChoiceGroupStory.story = {
	name: 'ButtonChoiceGroup',
}
