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

import { ITableSettings } from '../types'
import { useTableStyles } from '../hooks/useStyles'

export interface ICommunityTableProps {
	entities: IEntityDetail[]
	styles?: ITableSettings
	communityId?: CommunityId
	visibleColumns?: string[]
	minimize?: boolean
}

export const CommunityTable: React.FC<ICommunityTableProps> = memo(
	function CommunityTable({
		entities,
		minimize,
		styles,
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
		const [
			headerVariant,
			subheaderVariant,
			headerStyle,
			subheaderStyle,
			rootStyle,
		] = useTableStyles(styles)
		const headerText = communityId
			? `${communityId} Community Membership`
			: 'Community Membership'
		return (
			<Table className={'tableItems-root'} style={rootStyle}>
				<TableHeader>
					<TableRow>
						<TableHeaderRow
							colSpan={attrKeys.length + 1}
							className={'tableItems-header'}
							style={headerStyle}
						>
							<Text variant={headerVariant}>
								<Bold>{headerText}</Bold>
							</Text>
						</TableHeaderRow>
					</TableRow>
				</TableHeader>
				<THeader>
					<TableRow>
						{['id', ...attrKeys].map((key, i) => (
							<HeaderCell
								key={`table-header-${i}`}
								className={'tableItems-subheader'}
								style={subheaderStyle}
							>
								<Text variant={subheaderVariant} styles={textStyle}>
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
							styles={styles}
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
