/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList } from '@essex/arquero-react'
import { table } from 'arquero'
import { DetailsListLayoutMode, SelectionMode } from '@fluentui/react'

const meta = {
	title: '@essex:arquero-react/Arquero Details List',
}

export default meta

const mockTable = table({
	ID: [1, 2, 3, 4, 5, 6],
	FY20: [10000, 56000, 45000, 5000, 8900, 90000],
	FY21: [5000, 4000, 45000, 6000, 9000, 78000],
})

const mockColumns = [
	{
		key: 'ID',
		name: 'ID',
		fieldName: 'ID',
		minWidth: 50,
		iconName: 'FavoriteStarFill',
	},
]

const mockFeatures = {
	statsColumnHeaders: true,
	statsColumnTypes: ['type', 'min', 'max', 'distinct', 'invalid'],
}

/**
 * FilterTextboxStory is a FilterTextbox based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const ArqueroDetailsListStory = () => {
	return (
		<ArqueroDetailsList
			table={mockTable}
			features={mockFeatures}
			offset={0}
			limit={Infinity}
			includeAllColumns={true}
			visibleColumns={true}
			isSortable={true}
			isStriped={false}
			isColumnClickable={false}
			showColumnBorders={false}
			selectedColumn={true}
			selectionMode={SelectionMode.none}
			layoutMode={DetailsListLayoutMode.fixedColumns}
			columns={mockColumns}
			isHeadersFixed={false}
			compact={false}
			isResizable={true}
		/>
	)
}

ArqueroDetailsListStory.story = {
	name: 'ArqueroDetailsList',
}
