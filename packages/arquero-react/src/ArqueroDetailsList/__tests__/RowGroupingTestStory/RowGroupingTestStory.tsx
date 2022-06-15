/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata, ColumnMetadata } from '@essex/arquero'
import { introspect } from '@essex/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useEffect, useState, useCallback } from 'react'
import type { IDetailsGroupDividerProps } from '@fluentui/react'
import { createLazyLoadingGroupHeader } from '../component-factories.js'

export interface RowGroupingTestStoryProps {
	mockTable: ColumnTable | undefined
}

export const RowGroupingTestStory: React.FC<RowGroupingTestStoryProps> = memo(
	function RowGroupingTestStory({ mockTable }) {
		const [groupedTable, setGroupedTable] = useState<ColumnTable | undefined>()
		const [groupedMetadata, setGroupedMetadata] = useState<
			TableMetadata | undefined
		>()

		useEffect(() => {
			if (mockTable !== undefined) {
				let mockTableCopy = mockTable
				setGroupedTable(mockTableCopy.groupby(['Symbol', 'Month']))
				setGroupedMetadata(introspect(mockTableCopy, true))
			}
		}, [mockTable])

		const customGroupHeader = useCallback(
			(
				meta?: ColumnMetadata,
				columnName?: string,
				props?: IDetailsGroupDividerProps | undefined,
			) => {
				const custom = <h3>{meta?.name}</h3>
				return createLazyLoadingGroupHeader(props, custom, columnName, meta)
			},
			[],
		)

		if (!groupedTable || !groupedMetadata) {
			return <div>Loading</div>
		}

		return (
			<div style={{ marginTop: '12px', height: 'calc(100vh - 220px)' }}>
				<ArqueroTableHeader table={groupedTable} />
				<ArqueroDetailsList
					table={groupedTable}
					metadata={groupedMetadata}
					features={{
						smartCells: true,
						smartHeaders: true,
					}}
					onRenderGroupHeader={customGroupHeader}
					isSortable
				/>
			</div>
		)
	},
)
