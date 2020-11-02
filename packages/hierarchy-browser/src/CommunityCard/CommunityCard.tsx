/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { memo, useLayoutEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ICommunityDetail } from '..'
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
import { CommunityOverview } from './CommunityOverview'
import { CommunityTable } from './CommunityTable'

export interface ICommunityCardProps {
	community: ICommunityDetail
	maxSize: number
	maxLevel: number
	level: number
	hierachyDataProvider: HierarchyDataProvider
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	isOpen?: boolean
}

const ENTITY_LOADER_MSG = 'Fetching entity data...'

export const CommunityCard: React.FC<ICommunityCardProps> = memo(
	function CommunityCard({
		isOpen: isOpenProp,
		community,
		maxSize,
		maxLevel,
		level,
		incrementLevel,
		hierachyDataProvider,
	}: ICommunityCardProps) {
		const [dataProvider] = useState<CommunityDataProvider | undefined>(
			() => new CommunityDataProvider(community, hierachyDataProvider, level),
		)

		const neigborCommunities = useMemo(
			() => hierachyDataProvider.getNeighborsAtLevel(community.communityId),
			[hierachyDataProvider, community],
		)

		useLayoutEffect(() => {
			if (dataProvider) {
				dataProvider.neighborCommunities = neigborCommunities
			}
		}, [dataProvider, neigborCommunities])
		const [
			entities,
			isLoading,
			loadMore,
			hasMore,
			isOpen,
			toggleOpen,
			filterProps,
		] = useCommunityData(isOpenProp, maxLevel, dataProvider)

		const [
			adjacentCommunities,
			isAdjacentEntitiesLoading,
		] = useAdjacentCommunityData(isOpen, dataProvider)

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
				/>
				<Flex>
					<Content style={contentStyle}>
						{entities && entities.length > 0 ? (
							<ScrollArea loadMore={loadMore} hasMore={hasMore}>
								<CommunityTable
									entities={entities}
									minimize={false}
									communityId={community.communityId}
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
					{isAdjacentEntitiesLoading ||
					(edgeEntities && edgeEntities.length > 0) ? (
						<Content style={contentStyle}>
							{edgeEntities && edgeEntities.length > 0 ? (
								<ScrollArea
									loadMore={loadMoreEntities}
									hasMore={moreEntitiesToLoad}
								>
									<CommunityTable
										entities={edgeEntities}
										minimize={false}
										communityId={selectedCommunityEdge?.communityId}
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
