/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { CommunityId, IEntityDetail } from '..'
import { EntityItem } from '../EntityItem/EntityItem'
import { textStyle } from '../common/styles'
import { ICardFontStyles } from '../hooks/theme'

export interface ICommunityTableProps {
	entities: IEntityDetail[]
	fontStyles: ICardFontStyles
	communityId?: CommunityId
	visibleColumns?: string[]
	minimize?: boolean
}

export const CommunityTable: React.FC<ICommunityTableProps> = memo(
	function CommunityTable({
		entities,
		minimize,
		fontStyles,
		communityId,
		visibleColumns,
	}: ICommunityTableProps) {
		const attrKeys: string[] = useMemo(() => {
			if (visibleColumns) {
				return visibleColumns
			}
			if (minimize || !entities[0].attrs) {
				return []
			}
			return Object.keys(entities[0].attrs)
		}, [entities, minimize, visibleColumns])
		const headerLabel = communityId
			? `${communityId} Community Membership`
			: 'Community Membership'
		return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderRow colSpan={attrKeys.length + 1}>
							<Text variant={fontStyles.tableHeader}>
								<Bold>{headerLabel}</Bold>
							</Text>
						</TableHeaderRow>
					</TableRow>
				</TableHeader>
				<THeader>
					<TableRow>
						{['id', ...attrKeys].map((key, i) => (
							<HeaderCell key={`table-header-${i}`}>
								<Text variant={fontStyles.tableSubheader} styles={textStyle}>
									<Bold>{key}</Bold>
								</Text>
							</HeaderCell>
						))}
					</TableRow>
				</THeader>
				<TableBody>
					{entities.map((entity, i) => (
						<EntityItem
							key={`entity_${i}`}
							item={entity}
							attrs={attrKeys}
							index={i}
							fontStyle={fontStyles.tableItem}
						/>
					))}
				</TableBody>
			</Table>
		)
	},
)

CommunityTable.displayName = 'CommunityTableProps'

const THeader = styled.thead`
	font-weight: bold;
`

const TableRow = styled.tr``

const TableHeader = styled.thead``

const TableBody = styled.tbody``
const Bold = styled.div`
	font-weight: bold;
`

const Table = styled.table`
	width: 100%;
`
const HeaderCell = styled.th`
	width: 16%;
	width: 1px;
	white-space: nowrap;
`
const TableHeaderRow = styled.th`
	font-weight: bold;
	width: 1px;
	white-space: nowrap;
	text-align: center;
`
