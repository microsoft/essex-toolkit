/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { useCallback, memo } from 'react'
import styled from 'styled-components'
import { INeighborCommunityDetail } from '..'
import {
	rowSubHeader,
	rowHeader,
	tableItems,
	textStyle,
} from '../common/styles'
import { hexToRgb } from '../utils/utils'
import { useRowElements } from './hooks/useRowsElements'
import { useSortedNeighbors } from './hooks/useSortedNeighbors'
const SUBHEADERS = ['community', 'connections', 'members']

export interface ICommunityEdgeListProps {
	edges?: INeighborCommunityDetail[]
	onEdgeClick: (edge?: INeighborCommunityDetail) => Promise<void>
	clearCurrentSelection: () => Promise<void>
	selectedEdge?: INeighborCommunityDetail
}
const CommunityEdgeList: React.FC<ICommunityEdgeListProps> = memo(
	({ edges, selectedEdge, onEdgeClick, clearCurrentSelection }) => {
		const theme = useThematic()
		const handleEdgeClick = useCallback(
			(edge?: INeighborCommunityDetail) => {
				clearCurrentSelection().then(() => {
					if (
						edge &&
						selectedEdge &&
						edge.communityId === selectedEdge.communityId
					) {
						onEdgeClick(undefined)
					} else {
						onEdgeClick(edge)
					}
				})
			},
			[onEdgeClick, selectedEdge, clearCurrentSelection],
		)
		const sortedEdges = useSortedNeighbors(edges)

		const [
			getBackgroundColor,
			getMeasurements,
			getBackgroundStyle,
		] = useRowElements(theme, selectedEdge, edges)
		const nominalColorScale = theme.scales().nominal(10).toArray()

		return sortedEdges ? (
			<Table>
				<thead>
					<tr>
						<TableHeader colSpan={3}>
							<Text variant={rowHeader}>
								<b>Neighboring Communities</b>
							</Text>
						</TableHeader>
					</tr>
				</thead>
				<thead>
					{SUBHEADERS.map((header, index) => (
						<HeaderCell key={`subheader-${index}`}>
							<Text variant={rowSubHeader} styles={textStyle}>
								<b>{header}</b>
							</Text>
						</HeaderCell>
					))}
				</thead>
				{sortedEdges.map((edge, i) => {
					const measurements = getMeasurements(edge)
					return (
						<tr key={i}>
							<TableCell
								style={{ ...getBackgroundStyle(edge, 0) }}
								onClick={() => handleEdgeClick(edge)}
							>
								<Text variant={tableItems} styles={textStyle}>
									{edge.communityId}
								</Text>
							</TableCell>

							<TableCell
								style={{
									...getBackgroundStyle(edge, 1),
									backgroundImage: getBackgroundColor(
										hexToRgb(nominalColorScale[0]),
										measurements.connections,
									),
								}}
								key={`neighbor-community-${0}`}
								onClick={() => handleEdgeClick(edge)}
							>
								<Text variant={tableItems} styles={textStyle}>
									{edge.connections}
								</Text>
							</TableCell>
							<TableCell
								style={{
									...getBackgroundStyle(edge, 2),
									backgroundImage: getBackgroundColor(
										hexToRgb(nominalColorScale[1]),
										measurements.size,
									),
								}}
								key={`neighbor-community-${1}`}
								onClick={() => handleEdgeClick(edge)}
							>
								<Text variant={tableItems} styles={textStyle}>
									{edge.size}
								</Text>
							</TableCell>
						</tr>
					)
				})}
			</Table>
		) : null
	},
)
CommunityEdgeList.displayName = 'CommunityEdgeList'

export default CommunityEdgeList

const Table = styled.table`
	width: 100%;
`

const TableHeader = styled.th`
	font-weight: bold;
	width: 1px;
	white-space: nowrap;
	text-align: center;
`
const TableCell = styled.td`
	white-space: nowrap;
	width: 1px;
	border-style: solid;
	cursor: pointer;
`

const HeaderCell = styled.th`
	width: 1px;
	white-space: nowrap;
`
