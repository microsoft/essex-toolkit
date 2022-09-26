/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NumberSpinButton as NumberSpinButtonComponent } from '@essex/components'
import { useCallback, useState } from 'react'

const meta = {
	title: '@essex:components/NumberSpinButton',
}
export default meta
/**
 * NumberSpinButtonStory is based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const NumberSpinButton = () => {
	const [value, setValue] = useState(10)
	const handleChange = useCallback(n => setValue(n), [setValue])
	return (
		<NumberSpinButtonComponent
			label={'Label'}
			max={20}
			value={value}
			onChange={handleChange}
		/>
	)
}
