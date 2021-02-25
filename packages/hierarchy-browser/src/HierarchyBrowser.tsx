/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { CommunityCard } from './CommunityCard/CommunityCard'
import { useEntityProvider } from './common/dataProviders/hooks/useEntityProvider'
import { IDataProvidersCache, ICardOrder } from './common/types/types'
import {
	useCommunityLevelCalculator,
	useCommunitySizeCalculator,
} from './hooks/useCommunityDetails'
import { useCommunityProvider } from './hooks/useCommunityProvider'
import { useSettings } from './hooks/useSettings'
import {
	ICommunityDetail,
	IEntityDetail,
	IHierarchyNeighborResponse,
	ILoadEntitiesAsync,
	ILoadNeighborCommunities,
	ILoadNeighborCommunitiesAsync,
	ILoadParams,
	INeighborCommunityDetail,
	ISettings,
} from './types'
import { isEntitiesAsync } from './utils/utils'

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
		const [providerCache, setProviderCache] = useState<IDataProvidersCache>({})
		const [cardOrder, setCardOrder] = useState<ICardOrder>({})

		const neighborCallback: ILoadNeighborCommunities = useCallback(
			async (
				params: ILoadParams,
				communityId: string,
			): Promise<IHierarchyNeighborResponse> => {
				if (neighbors) {
					const isAsync = isEntitiesAsync(neighbors)
					if (isAsync) {
						const loader = neighbors as ILoadNeighborCommunitiesAsync
						return await loader(params)
					}
					const neighborsList = neighbors as INeighborCommunityDetail[]
					const data = neighborsList.filter(
						d => d.edgeCommunityId === communityId,
					)
					return { data, error: undefined }
				}
				return { data: [], error: new Error('neighbor communities not loaded') }
			},
			[neighbors],
		)

		const [
			minLevel,
			maxLevel,
			communityWithLevels,
		] = useCommunityLevelCalculator(communities)
		const maxSize = useCommunitySizeCalculator(communities)

		const loadEntitiesByCommunity = useEntityProvider(
			communityWithLevels,
			neighbors,
			entities,
		)

		useCommunityProvider({
			communities: communityWithLevels,
			setProviderCache,
			loadEntitiesByCommunity,
		})

		useMemo(() => {
			const sortOrder = communities.reduce((acc, c, index) => {
				const id = c.communityId
				acc[id] = index
				return acc
			}, {} as ICardOrder)
			setCardOrder(sortOrder)
		}, [communities])

		const getSettings = useSettings(settings)

		const sortedKeys = useMemo(
			() =>
				Object.keys(providerCache).sort((a, b) => cardOrder[a] - cardOrder[b]),
			[providerCache, cardOrder],
		)

		const getCommunityProvider = useCallback(
			(communityId: string) => providerCache[communityId],
			[providerCache],
		)

		return (
			<CardContainer>
				{sortedKeys.map((communityId: string, index: number) => {
					const provider = getCommunityProvider(communityId)
					const cardSettings = getSettings(index)
					return (
						<CommunityCard
							key={`_card_${index}_${communityId}`}
							incrementLevel={minLevel === 0}
							maxSize={maxSize}
							maxLevel={maxLevel}
							level={maxLevel - index}
							dataProvider={provider}
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
