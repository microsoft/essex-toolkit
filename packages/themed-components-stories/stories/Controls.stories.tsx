/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterTextbox,
	SearchBox,
	NumberSpinButton,
	ToggleLink,
} from '@essex-js-toolkit/themed-components'
import React, { useCallback, useState } from 'react'

import { CSF } from './types'

const meta = {
	title: 'Controls',
}

export default meta

/**
 * FilterTextboxStory is a FilterTextbox based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const FilterTextboxStory: CSF = () => {
	return (
		<FilterTextbox
			label={'Label'}
			includePlaceholder={'include placeholder'}
			excludePlaceholder={'exclude placeholder'}
		/>
	)
}

FilterTextboxStory.story = {
	name: 'FilterTextbox',
}

/**
 * SearchBoxStory is a SearchBox based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const SearchBoxStory: CSF = () => {
	return <SearchBox label={'Label'} placeholder={'placeholder'} />
}

SearchBoxStory.story = {
	name: 'SearchBox',
}

/**
 * NumberSpinButtonStory is based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const NumberSpinButtonStory: CSF = () => {
	const [value, setValue] = useState(10)
	const handleChange = useCallback(n => setValue(n), [setValue])
	return (
		<NumberSpinButton
			label={'Label'}
			max={20}
			value={value}
			onChange={handleChange}
		/>
	)
}

NumberSpinButtonStory.story = {
	name: 'NumberSpinButton',
}

export const ToggleLinkStory: CSF = () => {
	const [expanded, setExpanded] = useState<boolean>(false)
	const handleChange = useCallback(toggled => setExpanded(toggled), [])
	return (
		<div>
			This is a ToggleLink:{' '}
			<ToggleLink
				messages={['Show more', 'Show less']}
				onChange={handleChange}
			/>
			<div
				style={{
					width: 400,
					height: 100,
					display: expanded ? 'block' : 'none',
				}}
			>
				More information here!
			</div>
		</div>
	)
}

ToggleLinkStory.story = {
	name: 'ToggleLink',
}
