/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { SortDirection, TableMetadata } from '@essex/arquero'
import { introspect } from '@essex/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import { DetailsListLayoutMode, IColumn, SelectionMode } from '@fluentui/react'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

import { StatsColumnType } from '../types.js'
import { useColumnCommands, useCommandBar } from './ArqueroDetailsList.hooks.js'

const meta = {
	title: '@essex:arquero-react/ArqueroDetailsList',
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

export const ArqueroDetailsListPerformanceStory = (
	args,
	{ loaded: { mockTablePerformance } }: any,
) => {
	const [table, setTable] = useState<ColumnTable | undefined>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()
	const [tableName, setTableName] = useState('Table1')

	useEffect(() => {
		if (mockTablePerformance !== undefined) {
			mockTablePerformance.ungroup()
			let mockTablePerformanceCopy = mockTablePerformance
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 10; i++) {
				mockTablePerformanceCopy = mockTablePerformanceCopy.concat(
					mockTablePerformanceCopy,
				)
			}

			setTable(mockTablePerformanceCopy)
			setMetadata(introspect(mockTablePerformanceCopy, true))
		}
	}, [mockTablePerformance])

	const commandBar = useCommandBar(table, metadata, setTable, setMetadata)
	const columnCommands = useColumnCommands()

	const columns = useMemo((): IColumn[] | undefined => {
		if (table === undefined) return undefined
		return table.columnNames().map(x => {
			return {
				name: x,
				key: x,
				fieldName: x,
				minWidth: 180,
			} as IColumn
		})
	}, [table])

	if (!table || !metadata) {
		return <div>Loading</div>
	}

	return (
		<div style={{ marginTop: '12px', height: 'calc(100vh - 220px)' }}>
			<ArqueroTableHeader
				table={table}
				name={tableName}
				commandBar={commandBar}
				onRenameTable={name => setTableName(name)}
			/>

			<ArqueroDetailsList
				{...args}
				table={table}
				metadata={metadata}
				features={{
					smartCells: true,
					smartHeaders: true,
					commandBar: [columnCommands],
				}}
				columns={columns}
				isSortable
				isHeadersFixed
				isStriped
				showColumnBorders
			/>
		</div>
	)
}

ArqueroDetailsListPerformanceStory.story = {
	name: 'Performance story',
}
