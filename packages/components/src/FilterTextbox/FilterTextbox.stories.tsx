/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterTextbox } from '@essex/components'

const meta = {
	title: '@essex:components/Filter Textbox',
}

export default meta

/**
 * FilterTextboxStory is a FilterTextbox based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const FilterTextboxStory = () => {
	return (
		<FilterTextbox
			label={'Label'}
			includePlaceholder={'include placeholder'}
			excludePlaceholder={'exclude placeholder'}
		/>
	)
}

FilterTextboxStory.storyName = 'FilterTextbox'
