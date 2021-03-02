/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { useCallback, memo, useRef } from 'react'
import styled from 'styled-components'
import { INeighborCommunityDetail, ITableSettings } from '..'
import { textStyle } from '../common/styles'
import { useTableStyles } from '../hooks/useStyles'
import { Bar } from './Bar'
import { useRowElements } from './hooks/useRowsElements'
import { useSortedNeighbors } from './hooks/useSortedNeighbors'
import { useDimensions } from '@essex-js-toolkit/hooks'

const SUBHEADERS = ['community', 'connections', 'members']

export interface ICommunityEdgeListProps {
	edges?: INeighborCommunityDetail[]
	onEdgeClick: (edge?: INeighborCommunityDetail) => Promise<void>
	clearCurrentSelection: () => Promise<void>
	selectedEdge?: INeighborCommunityDetail
	isOpen: boolean
	styles?: ITableSettings
}
const CommunityEdgeList: React.FC<ICommunityEdgeListProps> = memo(
	function CommunityEdgeList({
		edges,
		selectedEdge,
		onEdgeClick,
		clearCurrentSelection,
		styles,
	}: ICommunityEdgeListProps) {
		const [
			headerVariant,
			subheaderVariant,
			headerStyle,
			subheaderStyle,
			rootStyle,
			itemStyle,
			itemVariant,
		] = useTableStyles(styles)

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
		const connRef = useRef(null)
		const memberDimensions = useDimensions(ref)
		const connectionDimensions = useDimensions(connRef)
		const [getBackgroundStyle, barColor, connScale, sizeScale] = useRowElements(
			theme,
			selectedEdge,
			edges,
			memberDimensions,
		)

		return sortedEdges ? (
			<Table className={'tableItems-root'} style={rootStyle}>
				<TableHead>
					<TableRow>
						<TableHeader
							colSpan={3}
							className={'tableItems-header'}
							style={headerStyle}
						>
							<Text variant={headerVariant}>
								<Bold>Neighboring Communities</Bold>
							</Text>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						{SUBHEADERS.map((header, index) => (
							<TableHeader
								key={`subheader-${index}`}
								className={'tableItems-subheader'}
								style={subheaderStyle}
							>
								<Text variant={subheaderVariant} styles={textStyle}>
									<Bold>{header}</Bold>
								</Text>
							</TableHeader>
						))}
					</TableRow>
					{sortedEdges.map((edge, i) => {
						return (
							<TableRow key={i}>
								<TableCell
									style={{
										...getBackgroundStyle(edge, 0, i),
										textAlign: 'center',
										...itemStyle,
									}}
									onClick={() => handleEdgeClick(edge)}
								>
									<Text variant={itemVariant} styles={textStyle}>
										{edge.communityId}
									</Text>
								</TableCell>

								<TableCell
									style={{
										...itemStyle,
										...getBackgroundStyle(edge, 1, i),
									}}
									key={`neighbor-community-${0}`}
									onClick={() => handleEdgeClick(edge)}
									ref={connRef}
								>
									<Separator>
										<AbsoluteDiv>
											<TextContainer>
												<Text variant={itemVariant} styles={textStyle}>
													{edge.connections}
												</Text>
											</TextContainer>
											{connectionDimensions?.width ? (
												<Bar
													value={edge.connections}
													width={connectionDimensions.width}
													height={connectionDimensions?.height || 25}
													color={barColor}
													scale={connScale}
												/>
											) : null}
										</AbsoluteDiv>
									</Separator>
								</TableCell>
								<TableCell
									style={{
										...itemStyle,
										...getBackgroundStyle(edge, 2, i),
									}}
									key={`neighbor-community-${1}`}
									onClick={() => handleEdgeClick(edge)}
									ref={ref}
								>
									<AbsoluteDiv>
										<TextContainer>
											<Text variant={itemVariant} styles={textStyle}>
												{edge.size}
											</Text>
										</TextContainer>

										{memberDimensions?.width ? (
											<Bar
												value={edge.size}
												width={memberDimensions.width}
												height={memberDimensions?.height || 25}
												color={barColor}
												scale={sizeScale}
											/>
										) : null}
									</AbsoluteDiv>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		) : null
	},
)
CommunityEdgeList.displayName = 'CommunityEdgeList'

export default CommunityEdgeList

const Table = styled.table`
	width: 100%;
`
const TableHead = styled.thead``

const TableRow = styled.tr``
const TableBody = styled.tbody``

const Separator = styled.div``
const Bold = styled.div`
	font-weight: bold;
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
	top: 0px;
	right: 5px;
	position: absolute;
`
const AbsoluteDiv = styled.div`
	top: 0;
`
