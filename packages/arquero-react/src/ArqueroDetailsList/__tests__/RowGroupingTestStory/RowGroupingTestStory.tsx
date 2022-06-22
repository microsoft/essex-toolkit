/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@essex/arquero'
import { introspect } from '@essex/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import { Label } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useEffect, useState } from 'react'

import { useToggleTableFeatures } from './RowGroupingTestStory.hooks.js'
import {
	ButtonContainer,
	GroupByToggle,
} from './RowGroupingTestStory.styles.js'
import { Table } from '../SharedStyles.styles.js'

export interface RowGroupingTestStoryProps {
	mockTable: ColumnTable | undefined
}

export const RowGroupingTestStory: React.FC<RowGroupingTestStoryProps> = memo(
	function RowGroupingTestStory({ mockTable }) {
		const [groupedTable, setGroupedTable] = useState<ColumnTable | undefined>()
		const [groupedMetadata, setGroupedMetadata] = useState<
			TableMetadata | undefined
		>()

		const [groupByList, setGroupByList] = useState<string[]>([])

		useEffect(() => {
			if (mockTable !== undefined) {
				let mockTableCopy = mockTable

				if (groupByList.length > 0)
					mockTableCopy = mockTableCopy.groupby(groupByList)

				setGroupedTable(mockTableCopy)
				setGroupedMetadata(introspect(mockTableCopy, true))
			}
		}, [mockTable, groupByList])

		const { tableFeatures } = useToggleTableFeatures()

		function _onChangeSymbol(
			ev: React.MouseEvent<HTMLElement>,
			checked?: boolean,
		) {
			if (checked) {
				setGroupByList([...groupByList, 'Symbol'])
			} else {
				let listCopy = groupByList.filter(e => e !== 'Symbol')
				setGroupByList(listCopy)
			}
		}

		function _onChangeMonth(
			ev: React.MouseEvent<HTMLElement>,
			checked?: boolean,
		) {
			if (checked) {
				setGroupByList([...groupByList, 'Month'])
			} else {
				let listCopy = groupByList.filter(e => e !== 'Month')
				setGroupByList(listCopy)
			}
		}

		if (!groupedTable || !groupedMetadata) {
			return <div>Loading...</div>
		}

		console.log(groupByList)

		return (
			<Table>
				<Label>Group by: </Label>
				<ButtonContainer>
					<GroupByToggle
						label="Symbol"
						onText="On"
						offText="Off"
						onChange={_onChangeSymbol}
					/>
					<GroupByToggle
						label="Month"
						onText="On"
						offText="Off"
						onChange={_onChangeMonth}
					/>
				</ButtonContainer>

				<ArqueroTableHeader table={groupedTable} />
				<ArqueroDetailsList
					isSortable
					compact
					showColumnBorders
					isHeadersFixed
					table={groupedTable}
					metadata={groupedMetadata}
					features={{
						...tableFeatures,
						smartCells: true,
						smartHeaders: true,
					}}
				/>
			</Table>
		)
	},
)
