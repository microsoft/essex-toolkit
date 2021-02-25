/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { CommunityCard } from './CommunityCard/CommunityCard'
import { HierarchyDataProvider } from './common/dataProviders/HierachyDataProvider'
import {
	IDataProvidersCache,
	ICardOrder,
	ICommunity,
} from './common/types/types'
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
import { useEntityProvider } from './common/dataProviders/hooks/useEntityProvider'

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

		const neighborCallback = useUpdatedHierarchyProvider(
			communities,
			hierachyDataProvider,
			entities,
			neighbors,
		)
		const [minLevel, maxLevel] = useCommunityLevelCalculator(communities)
		const maxSize = useCommunitySizeCalculator(communities)

		const communityWithLevels = useMemo(() => {
			const reverseList = [...communities].reverse()
			return reverseList.map(
				(comm, index) =>
					Object.assign({}, { ...comm, level: index }) as ICommunity,
			)
		}, [communities])

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
