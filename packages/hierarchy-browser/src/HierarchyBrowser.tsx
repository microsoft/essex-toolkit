/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CommunityCard } from './CommunityCard/CommunityCard'
import { HierarchyDataProvider } from './common/dataProviders/HierachyDataProvider'
import { IDataProvidersCache, ICardOrder } from './common/types/types'
import {
	useCommunityLevelCalculator,
	useCommunitySizeCalculator,
} from './hooks/useCommunityDetails'
import { useCommunityProvider } from './hooks/useCommunityProvider'
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

/**
 * Component creates tables to view connected data while also applying default thematic styles and data colors.
 * @param communities required ICommunityDetail[]
 * @param entities (optional) IEntityDetail[] | ILoadEntitiesAsync
 * @param neighbors (optional) INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync
 * @param settings (optional) ISettings
 */
export const HierarchyBrowser: React.FC<IHierarchyBrowserProps> = memo(
	function HierarchyBrowser({
		communities,
		entities,
		neighbors,
		settings,
	}: IHierarchyBrowserProps) {
		/*eslint-disable react-hooks/exhaustive-deps*/
		const hierachyDataProvider = useMemo<HierarchyDataProvider>(
			() => new HierarchyDataProvider(),
			[
				/* no deps intentionally */
			],
		)
		/*eslint-enable react-hooks/exhaustive-deps*/
		const [providerCache, setProviderCache] = useState<IDataProvidersCache>({})
		const [cardOrder, setCardOrder] = useState<ICardOrder>({})

		const [isNeighborsLoaded, neighborCallback] = useUpdatedHierarchyProvider(
			communities,
			hierachyDataProvider,
			entities,
			neighbors,
		)
		const [minLevel, maxLevel] = useCommunityLevelCalculator(communities)
		const maxSize = useCommunitySizeCalculator(communities)
		useCommunityProvider({
			communities,
			setProviderCache,
			hierachyDataProvider,
			setCardOrder,
		})

		const getSettings = useSettings(settings)

		return (
			<CardContainer>
				{Object.keys(providerCache)
					.sort((a, b) => cardOrder[a] - cardOrder[b])
					.map((communityId, index) => {
						const provider = providerCache[communityId]
						const cardSettings = getSettings(index)
						return (
							<CommunityCard
								key={`_card_${index}_${communityId}`}
								incrementLevel={minLevel === 0}
								maxSize={maxSize}
								maxLevel={maxLevel}
								level={maxLevel - index}
								dataProvider={provider}
								neighborsLoaded={isNeighborsLoaded}
								neighborCallback={neighborCallback}
								settings={cardSettings}
							/>
						)
					})}
			</CardContainer>
		)
	},
)

const CardContainer = styled.div`
	margin: 10px 10px 10px 10px;
	overflow-y: auto;
`
