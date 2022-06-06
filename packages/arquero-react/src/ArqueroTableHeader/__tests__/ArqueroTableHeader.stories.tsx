/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader } from '@essex/arquero-react'
import { table } from 'arquero'

const meta = {
	title: '@essex:arquero-react/Arquero Table Header',
}

export default meta

const mockTable = table({
	ID: [1, 2, 3, 4, 5, 6],
	FY20: [10000, 56000, 45000, 5000, 8900, 90000],
	FY21: [5000, 4000, 45000, 6000, 9000, 78000],
})

/**
 * ArqueroTableHeaderStory is a ArqueroTableHeader based
 */
export const ArqueroTableHeaderStory = () => {
	return (
		<ArqueroTableHeader
			table={mockTable}
			name={'Test'}
			showRowCount={true}
			showColumnCount={true}
			visibleColumns={['ID', 'FY20', 'FY21']}
		/>
	)
}

ArqueroTableHeaderStory.story = {
	name: 'ArqueroTableHeader',
}
