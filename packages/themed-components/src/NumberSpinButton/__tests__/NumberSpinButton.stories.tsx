/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NumberSpinButton } from '@essex/themed-components'
import { useCallback, useState } from 'react'

/**
 * NumberSpinButtonStory is based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const NumberSpinButtonStory = () => {
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
