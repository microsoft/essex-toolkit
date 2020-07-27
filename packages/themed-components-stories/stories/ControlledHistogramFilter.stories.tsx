/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import { useState } from 'react'
import { ControlledHistogramFilter } from '@essex-js-toolkit/themed-components'
import { CSF } from './types'

export default {
	title: 'ControlledHistogramFilter',
}

const data = [
	1,
	2,
	3,
	4,
	3,
	2,
	3,
	4,
	3,
	2,
	3,
	4,
	5,
	4,
	5,
	6,
	5,
	6,
	5,
	4,
	3,
	4,
	3,
	2,
	3,
	2,
	3,
	4,
	3,
	6,
	7,
	8,
	7,
	8,
	7,
	8,
	7,
	8,
	9,
	8,
	9,
	8,
	7,
	6,
	7,
	6,
	5,
	6,
]

/**
 * ControlledHistogramFilter story shows basic capabilities
 * of brushing and menu filter for thematic themed D3 histogram
 */
export const ControlledHistogramFilterStory: CSF = () => {
	const [selectedRange, setSelectedRange] = useState<
		[number | undefined, number | undefined]
	>([undefined, undefined])
	const handleRangeChanged = (
		range: [number | undefined, number | undefined],
	) => {
		setSelectedRange(range)
	}
	return (
		<ControlledHistogramFilter
			name={'name'}
			data={data}
			width={600}
			height={400}
			selectedRange={selectedRange}
			onChange={handleRangeChanged}
		/>
	)
}

ControlledHistogramFilterStory.story = {
	name: 'main',
}
