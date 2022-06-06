/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@essex/arquero'
import { ArqueroDetailsList } from '@essex/arquero-react'
import { DetailsListLayoutMode, SelectionMode } from '@fluentui/react'
import { table } from 'arquero'

import { StatsColumnType } from '../types.js'

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
	statsColumnTypes: [
		StatsColumnType.Type,
		StatsColumnType.Min,
		StatsColumnType.Max,
		StatsColumnType.Distinct,
		StatsColumnType.Invalid,
	],
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
			visibleColumns={['ID', 'FY20', 'FY21']}
			isSortable={true}
			isStriped={false}
			isColumnClickable={false}
			showColumnBorders={false}
			selectionMode={SelectionMode.none}
			layoutMode={DetailsListLayoutMode.fixedColumns}
			columns={mockColumns}
			isHeadersFixed={false}
			compact={false}
			isResizable={true}
			defaultSortDirection={SortDirection.Ascending}
			defaultSortColumn={'FY21'}
		/>
	)
}

ArqueroDetailsListStory.story = {
	name: 'ArqueroDetailsList',
}
