/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ICommunityDetail, ILoadNeighborCommunities } from '..'
import { EmptyEntityList } from '../EntityItem/EmptyEntityList'
import CommunityEdgeList from '../NeighborList/CommunityEdgeList'
import { ScrollArea } from '../ScollArea'
import { CommunityDataProvider } from '../common/dataProviders'
import { HierarchyDataProvider } from '../common/dataProviders/HierachyDataProvider'
import { useContainerStyle, useThemesAccentStyle } from '../hooks/theme'
import { useAdjacentCommunityData } from '../hooks/useAdjacentCommunityData'
import { useCommunityData } from '../hooks/useCommunityData'
import { useCommunitySizePercent } from '../hooks/useCommunitySizePercent'
import { useEdgeSelection } from '../hooks/useEdgeSelection'
import { ISettingState } from '../hooks/useSettings'
import { useUpdatedCommunityProvider } from '../hooks/useUpdatedCommunityProvider'
import { CommunityOverview } from './CommunityOverview'
import { CommunityTable } from './CommunityTable'

export interface ICommunityCardProps {
	community: ICommunityDetail
	maxSize: number
	maxLevel: number
	level: number
	hierachyDataProvider: HierarchyDataProvider
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	neighborsLoaded: boolean
	neighborCallback?: ILoadNeighborCommunities
	settings: ISettingState
}

const ENTITY_LOADER_MSG = 'Fetching entity data...'

export const CommunityCard: React.FC<ICommunityCardProps> = memo(
	function CommunityCard({
		community,
		maxSize,
		maxLevel,
		level,
		incrementLevel,
		neighborsLoaded,
		hierachyDataProvider,
		neighborCallback,
		settings,
	}: ICommunityCardProps) {
		const dataProvider = useMemo<CommunityDataProvider>(
			() => new CommunityDataProvider(community, hierachyDataProvider, level),
			[],
		)

		const {
			isOpen: isOpenProp,
			minimizeColumns,
			visibleColumns,
			fontStyles,
			controls,
		} = settings

		useUpdatedCommunityProvider(
			hierachyDataProvider,
			dataProvider,
			community,
			level,
			neighborCallback,
		)
		const size = useMemo(() => community.size, [community])

		const [
			entities,
			isLoading,
			loadMore,
			hasMore,
			isOpen,
			toggleOpen,
			filterProps,
		] = useCommunityData(dataProvider, isOpenProp, maxLevel, size)

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
		const sizePercent = useCommunitySizePercent(community, maxSize)
		const contentStyle = useContainerStyle(isOpen, entities.length > 0)

		const loadingElement = useMemo(
			() => (isLoading ? <Spinner label={ENTITY_LOADER_MSG} /> : null),
			[isLoading],
		)

		const colorStyle = useThemesAccentStyle(isOpen)

		return (
			<div>
				<CommunityOverview
					community={community}
					onToggleOpen={toggleOpen}
					incrementLevel={incrementLevel}
					sizePercent={sizePercent}
					filterProps={filterProps}
					getEntityCallback={loadMore}
					level={level}
					fontStyles={fontStyles}
					controls={controls}
				/>
				<Flex>
					<Content style={contentStyle}>
						{entities?.length > 0 ? (
							<ScrollArea loadMore={loadMore} hasMore={hasMore}>
								<CommunityTable
									entities={entities}
									communityId={community.communityId}
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
					<Spacer style={colorStyle}></Spacer>
					{adjacentCommunities && adjacentCommunities.length > 0 ? (
						<Content style={contentStyle}>
							<CommunityEdgeList
								edges={adjacentCommunities}
								selectedEdge={selectedCommunityEdge}
								onEdgeClick={setEdgeSelection}
								clearCurrentSelection={clearCurrentSelection}
							/>
						</Content>
					) : null}
					{isAdjacentEntitiesLoading || edgeEntities?.length > 0 ? (
						<Content style={contentStyle}>
							{edgeEntities?.length > 0 ? (
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
					) : null}
				</Flex>
			</div>
		)
	},
)

const Flex = styled.div`
	display: flex;
`

const Content = styled.div`
	overflow-y: auto;
	transition: height 0.2s;
	flex: 1;
`
const Spacer = styled.div`
	width: 10px;
	border-style: solid;
	border-width: 0px 0.5px 0px 0.5px;
`
