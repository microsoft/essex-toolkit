/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ToggleLink } from '@essex/themed-components'
import { useCallback, useState } from 'react'

const meta = {
	title: 'ToggleLink',
}

export default meta

export const ToggleLinkStory = () => {
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
