/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CommunityCard } from './CommunityCard/CommunityCard'
import { HierarchyDataProvider } from './common/dataProviders/HierachyDataProvider'
import {
	useCommunityLevelCalculator,
	useCommunitySizeCalculator,
} from './hooks/useCommunityDetails'
import { useSettings } from './hooks/useSettings'
import { useUpdatedHierarchyProvider } from './hooks/useUpdatedHierarchyProvider'
import {
	ICommunityDetail,
	IEntityDetail,
	ILoadEntitiesAsync,
	ILoadNeighborCommunitiesAsync,
	INeighborCommunityDetail,
	ISettings,
} from './types'

export interface IHierarchyBrowserProps {
	communities: ICommunityDetail[]
	entities?: IEntityDetail[] | ILoadEntitiesAsync
	neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync
	settings?: ISettings
}

export const HierarchyBrowser = memo(function HierarchyBrowser({
	communities,
	entities,
	neighbors,
	settings,
}: IHierarchyBrowserProps) {
	const hierachyDataProvider = useMemo<HierarchyDataProvider>(
		() => new HierarchyDataProvider(communities, entities, neighbors),
		[],
	)
	const [isNeighborsLoaded, neighborCallback] = useUpdatedHierarchyProvider(
		communities,
		hierachyDataProvider,
		entities,
		neighbors,
	)
	const [minLevel, maxLevel] = useCommunityLevelCalculator(communities)
	const maxSize = useCommunitySizeCalculator(communities)

	const getSettings = useSettings(settings)
	const children = useMemo(
		() =>
			communities.map((c, index) => {
				const cardSettings = getSettings(index)
				return (
					<CommunityCard
						community={c}
						key={`_card_${index}_${c.communityId}`}
						incrementLevel={minLevel === 0}
						maxSize={maxSize}
						maxLevel={maxLevel}
						hierachyDataProvider={hierachyDataProvider}
						level={maxLevel - index}
						neighborsLoaded={isNeighborsLoaded}
						neighborCallback={neighborCallback}
						settings={cardSettings}
					/>
				)
			}),
		[
			communities,
			maxLevel,
			maxSize,
			minLevel,
			hierachyDataProvider,
			isNeighborsLoaded,
			neighborCallback,
			getSettings,
		],
	)

	return (
		<div>
			<CardContainer>{children}</CardContainer>
		</div>
	)
})

const CardContainer = styled.div`
	margin: 10px 10px 10px 10px;
	overflow-y: auto;
`
