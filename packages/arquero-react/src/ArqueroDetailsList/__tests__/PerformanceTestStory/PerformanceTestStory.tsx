import { memo, useEffect, useMemo, useState } from 'react'
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { TableMetadata } from '@essex/arquero'
import { introspect } from '@essex/arquero'
import {
	useColumnCommands,
	useCommandBar,
} from './PerformanceTestStory.hooks.js'
import { IColumn } from '@fluentui/react'

export interface PerformanceTestStoryProps {
	mockTablePerformance: ColumnTable | undefined
}

export const PerformanceTestStory: React.FC<PerformanceTestStoryProps> = memo(
	function PerformanceTestStory({ mockTablePerformance }) {
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
	},
)
