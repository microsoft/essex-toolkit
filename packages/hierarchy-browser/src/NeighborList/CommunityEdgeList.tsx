/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { useCallback, memo, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { INeighborCommunityDetail } from '..'
import {
	rowSubHeader,
	rowHeader,
	tableItems,
	textStyle,
} from '../common/styles'
import { useRowElements } from './hooks/useRowsElements'
import { useSortedNeighbors } from './hooks/useSortedNeighbors'
import { useDimensions } from '@essex-js-toolkit/hooks'
import { Bar } from './Bar'

const SUBHEADERS = ['community', 'connections', 'members']

export interface ICommunityEdgeListProps {
	edges?: INeighborCommunityDetail[]
	onEdgeClick: (edge?: INeighborCommunityDetail) => Promise<void>
	clearCurrentSelection: () => Promise<void>
	selectedEdge?: INeighborCommunityDetail
}
const CommunityEdgeList: React.FC<ICommunityEdgeListProps> = memo(
	function CommunityEdgeList({
		edges,
		selectedEdge,
		onEdgeClick,
		clearCurrentSelection,
	}: ICommunityEdgeListProps) {
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
		const ref = useRef(null)
		const dimensions = useDimensions(ref)
		const [getBackgroundStyle, barColor, connScale, sizeScale] = useRowElements(
			theme,
			selectedEdge,
			edges,
			dimensions,
		)

		const width = useMemo(() => (dimensions ? dimensions.width : 10), [
			dimensions,
		])

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
				<tbody>
					<tr>
						{SUBHEADERS.map((header, index) => (
							<TableHeader key={`subheader-${index}`}>
								<Text variant={rowSubHeader} styles={textStyle}>
									<b>{header}</b>
								</Text>
							</TableHeader>
						))}
					</tr>
					{sortedEdges.map((edge, i) => {
						return (
							<tr key={i}>
								<TableCell
									style={{
										...getBackgroundStyle(edge, 0, i),
										textAlign: 'center',
									}}
									onClick={() => handleEdgeClick(edge)}
								>
									<Text variant={tableItems} styles={textStyle}>
										{edge.communityId}
									</Text>
								</TableCell>

								<TableCell
									style={{
										...getBackgroundStyle(edge, 1, i),
									}}
									key={`neighbor-community-${0}`}
									onClick={() => handleEdgeClick(edge)}
									ref={ref}
								>
									<div>
										<AbsoluteDiv>
											<TextContainer>
												<Text variant={tableItems} styles={textStyle}>
													{edge.connections}
												</Text>
											</TextContainer>
											<Bar
												value={edge.connections}
												width={width}
												height={25}
												color={barColor}
												scale={connScale}
											/>
										</AbsoluteDiv>
									</div>
								</TableCell>
								<TableCell
									style={{
										...getBackgroundStyle(edge, 2, i),
									}}
									key={`neighbor-community-${1}`}
									onClick={() => handleEdgeClick(edge)}
								>
									<div>
										<AbsoluteDiv>
											<TextContainer>
												<Text variant={tableItems} styles={textStyle}>
													{edge.size}
												</Text>
											</TextContainer>

											<Bar
												value={edge.size}
												width={width}
												height={25}
												color={barColor}
												scale={sizeScale}
											/>
										</AbsoluteDiv>
									</div>
								</TableCell>
							</tr>
						)
					})}
				</tbody>
			</Table>
		) : null
	},
)
CommunityEdgeList.displayName = 'CommunityEdgeList'

export default CommunityEdgeList

const Table = styled.table`
	width: 100%;
`

const TableHeader = styled.td`
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
	text-align: end;
	position: relative;
`
const TextContainer = styled.div`
	z-index: 2;
	left: -10;
	width: 100%;
	position: absolute;
`
const AbsoluteDiv = styled.div`
	position: absolute;
	top: 0;
`
