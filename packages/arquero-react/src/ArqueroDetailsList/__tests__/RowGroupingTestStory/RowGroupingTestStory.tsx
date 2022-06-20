/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata, TableMetadata } from '@essex/arquero'
import { introspect } from '@essex/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import type { IDetailsGroupDividerProps } from '@fluentui/react'
import { Label, PrimaryButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useEffect, useState } from 'react'

import { createLazyLoadingGroupHeader } from '../component-factories.js'
import { useToggleTableFeatures } from './RowGroupingTestStory.hooks.js'
import { ButtonContainer } from './RowGroupingTestStory.styles.js'
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

		const [groupBy, setGroupBy] = useState<string>('')

		useEffect(() => {
			if (mockTable !== undefined) {
				let mockTableCopy = mockTable

				if (groupBy !== '') mockTableCopy = mockTableCopy.groupby([groupBy])

				setGroupedTable(mockTableCopy)
				setGroupedMetadata(introspect(mockTableCopy, true))
			}
		}, [mockTable, groupBy])

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

		const { tableFeatures } = useToggleTableFeatures()

		if (!groupedTable || !groupedMetadata) {
			return <div>Loading</div>
		}

		return (
			<Table>
				<Label>Group by: </Label>
				<ButtonContainer>
					<PrimaryButton onClick={() => setGroupBy('Symbol')}>
						Symbol
					</PrimaryButton>
					<PrimaryButton onClick={() => setGroupBy('Month')}>
						Month
					</PrimaryButton>
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
					onRenderGroupHeader={customGroupHeader}
				/>
			</Table>
		)
	},
)
