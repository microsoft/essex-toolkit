/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { ILoadNeighborCommunities } from '..'
import { EmptyEntityList } from '../EntityItem/EmptyEntityList'
import CommunityEdgeList from '../NeighborList/CommunityEdgeList'
import { ScrollArea } from '../ScollArea'
import { CommunityDataProvider } from '../common/dataProviders'
import { useContainerStyle, useThemesAccentStyle } from '../hooks/theme'
import { useAdjacentCommunityData } from '../hooks/useAdjacentCommunityData'
import { useCommunityData } from '../hooks/useCommunityData'
import { useCommunitySizePercent } from '../hooks/useCommunitySizePercent'
import { useEdgeSelection } from '../hooks/useEdgeSelection'
import { useExpandedPanel } from '../hooks/useExpandedPanel'
import { ISettingState } from '../hooks/useSettings'
import { useUpdatedCommunityProvider } from '../hooks/useUpdatedCommunityProvider'
import { CommunityOverview } from './CommunityOverview'
import { CommunityTable } from './CommunityTable'
import { TableExpander } from './TableExpander'

export interface ICommunityCardProps {
	maxSize: number
	maxLevel: number
	level: number
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	neighborsLoaded: boolean
	neighborCallback?: ILoadNeighborCommunities
	settings: ISettingState
	dataProvider: CommunityDataProvider
}

const ENTITY_LOADER_MSG = 'Fetching entity data...'

export const CommunityCard: React.FC<ICommunityCardProps> = memo(
	function CommunityCard({
		maxSize,
		maxLevel,
		level,
		incrementLevel,
		neighborsLoaded,
		neighborCallback,
		settings,
		dataProvider,
	}: ICommunityCardProps) {
		const {
			isOpen: isOpenProp,
			minimizeColumns,
			visibleColumns,
			fontStyles,
			controls,
		} = settings

		useUpdatedCommunityProvider(dataProvider, level, neighborCallback)

		const [
			entities,
			isLoading,
			loadMore,
			hasMore,
			isOpen,
			toggleOpen,
			filterProps,
		] = useCommunityData(dataProvider, isOpenProp, maxLevel)

		const [
			adjacentCommunities,
			isAdjacentEntitiesLoading,
		] = useAdjacentCommunityData(dataProvider, isOpen, neighborsLoaded)

		const [
			setEdgeSelection,
			loadMoreEntities,
			moreEntitiesToLoad,
			edgeEntities,
			selectedCommunityEdge,
			clearCurrentSelection,
		] = useEdgeSelection(dataProvider)
		const sizePercent = useCommunitySizePercent(dataProvider.size, maxSize)
		const contentStyle = useContainerStyle(isOpen, entities.length > 0)

		const loadingElement = useMemo(
			() => (isLoading ? <Spinner label={ENTITY_LOADER_MSG} /> : null),
			[isLoading],
		)

		const colorStyle = useThemesAccentStyle(isOpen)

		const {
			edgeContentStyle,
			edgeEntitiesContentStyle,
			edgeEntitiesExpanderClick,
			edgeExpanderClick,
			edgeListOpen,
			edgeEntitiesOpen,
		} = useExpandedPanel({ isOpen, entities })

		return (
			<Container>
				<CommunityOverview
					communityId={dataProvider.communityId}
					onToggleOpen={toggleOpen}
					incrementLevel={incrementLevel}
					sizePercent={sizePercent}
					filterProps={filterProps}
					getEntityCallback={loadMore}
					level={level}
					fontStyles={fontStyles}
					controls={controls}
					neighborSize={dataProvider.neighborSize}
					size={dataProvider.size}
				/>
				<Flex>
					<Content style={contentStyle}>
						{entities?.length > 0 ? (
							<ScrollArea loadMore={loadMore} hasMore={hasMore}>
								<CommunityTable
									entities={entities}
									communityId={dataProvider.communityId}
									visibleColumns={visibleColumns}
									fontStyles={fontStyles}
									minimize={minimizeColumns}
								/>
							</ScrollArea>
						) : null}
						{loadingElement}
						<EmptyEntityList
							filterProps={filterProps}
							entities={entities}
							isLoading={isLoading}
						/>
					</Content>

					{adjacentCommunities && adjacentCommunities.length > 0 ? (
						<>
							<Spacer style={colorStyle}>
								{isOpen ? (
									<TableExpander
										isOpen={edgeListOpen}
										handleButtonClick={edgeExpanderClick}
									/>
								) : null}
							</Spacer>
							<Content style={edgeContentStyle}>
								<CommunityEdgeList
									edges={adjacentCommunities}
									selectedEdge={selectedCommunityEdge}
									onEdgeClick={setEdgeSelection}
									clearCurrentSelection={clearCurrentSelection}
									isOpen={edgeListOpen}
								/>
							</Content>
						</>
					) : null}
					{isAdjacentEntitiesLoading || edgeEntities?.length > 0 ? (
						<>
							<Spacer style={colorStyle}>
								{isOpen ? (
									<TableExpander
										isOpen={edgeEntitiesOpen}
										handleButtonClick={edgeEntitiesExpanderClick}
									/>
								) : null}
							</Spacer>
							<Content style={edgeEntitiesContentStyle}>
								{edgeEntities?.length > 0 && edgeEntitiesOpen ? (
									<ScrollArea
										loadMore={loadMoreEntities}
										hasMore={moreEntitiesToLoad}
									>
										<CommunityTable
											entities={edgeEntities}
											communityId={selectedCommunityEdge?.communityId}
											visibleColumns={visibleColumns}
											fontStyles={fontStyles}
											minimize={minimizeColumns}
										/>
									</ScrollArea>
								) : null}
								{isAdjacentEntitiesLoading ? (
									<Spinner label={ENTITY_LOADER_MSG} />
								) : null}
							</Content>
						</>
					) : null}
				</Flex>
			</Container>
		)
	},
)

const Container = styled.div``

const Flex = styled.div`
	display: flex;
`

const Content = styled.div`
	overflow-y: auto;
	transition: height 0.2s;
`
const Spacer = styled.div`
	border-style: solid;
	border-width: 0px 0.5px 0px 0.5px;
	align-self: center;
`
