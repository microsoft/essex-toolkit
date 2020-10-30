/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { CommunityId, IEntityDetail } from '..'
import { EntityItem } from '../EntityItem/EntityItem'
import { rowHeader, rowSubHeader, textStyle } from '../common/styles'

export interface ICommunityTableProps {
	entities: IEntityDetail[]
	minimize: boolean
	communityId?: CommunityId
}

export const CommunityTable: React.FC<ICommunityTableProps> = memo(
	({ entities, minimize, communityId }) => {
		const attrKeys: string[] = useMemo(() => {
			if (minimize || !entities[0].attrs) {
				return []
			}
			return Object.keys(entities[0].attrs)
		}, [entities, minimize])
		const headerLabel = communityId
			? `${communityId} Community Membership`
			: 'Community Membership'
		return (
			<Table>
				<thead>
					<tr>
						<TableHeader colSpan={attrKeys.length + 1}>
							<Text variant={rowHeader}>
								<b>{headerLabel}</b>
							</Text>
						</TableHeader>
					</tr>
				</thead>
				<THeader>
					<tr>
						{['id', ...attrKeys].map((key, i) => (
							<HeaderCell key={`table-header-${i}`}>
								<Text variant={rowSubHeader} styles={textStyle}>
									<b>{key}</b>
								</Text>
							</HeaderCell>
						))}
					</tr>
				</THeader>
				<tbody>
					{entities.map((entity, i) => (
						<EntityItem
							key={`entity_${i}`}
							item={entity}
							attrs={attrKeys}
							index={i}
						/>
					))}
				</tbody>
			</Table>
		)
	},
)

CommunityTable.displayName = 'CommunityTableProps'

const THeader = styled.thead`
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
const TableHeader = styled.th`
	font-weight: bold;
	width: 1px;
	white-space: nowrap;
	text-align: center;
`
