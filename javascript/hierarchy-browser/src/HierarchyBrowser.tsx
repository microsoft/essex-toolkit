/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react'
import styled from 'styled-components'

import { CommunityCard } from './CommunityCard/CommunityCard.js'
import { useEntityProvider } from './common/dataProviders/hooks/useEntityProvider.js'
import type { ICardOrder, IDataProvidersCache } from './common/types/types.js'
import {
	useCommunityLevelCalculator,
	useCommunitySizeCalculator,
} from './hooks/useCommunityDetails.js'
import { useCommunityProvider } from './hooks/useCommunityProvider.js'
import { useSettings } from './hooks/useSettings.js'
import type {
	EntityId,
	ICommunityDetail,
	IEntityDetail,
	IHierarchyNeighborResponse,
	ILoadEntitiesAsync,
	ILoadNeighborCommunities,
	ILoadNeighborCommunitiesAsync,
	ILoadParams,
	INeighborCommunityDetail,
	IOnSelectionChange,
	ISettings,
} from './types/index.js'
import { isEntitiesAsync } from './utils/utils.js'

export interface IHierarchyBrowserProps {
	communities: ICommunityDetail[]
	entities?: IEntityDetail[] | ILoadEntitiesAsync
	neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync
	settings?: ISettings
	selections?: EntityId[]
	onSelectionChange?: IOnSelectionChange
}

/**
 * Component creates tables to view connected data while also applying default thematic styles and data colors.
 * @param communities - required ICommunityDetail[]
 * @param entities - (optional) IEntityDetail[] | ILoadEntitiesAsync
 * @param neighbors - (optional) INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync
 * @param settings - (optional) ISettings
 * @param selections - (optional)  EntityId[]
 * @param onSelectionChange - (optional) IOnSelectionChange
 */
export const HierarchyBrowser: React.FC<IHierarchyBrowserProps> =
	function HierarchyBrowser({
		communities,
		entities,
		neighbors,
		settings,
		selections,
		onSelectionChange,
	}: IHierarchyBrowserProps) {
		const [providerCache, setProviderCache] = useState<IDataProvidersCache>({})

		const [selectedIds, setSelectedIds] = useState<EntityId[] | undefined>()

		const [forceUpdateNeighbors, setForceNeighborUpdate] =
			useState<boolean>(false)

		useEffect(() => {
			setForceNeighborUpdate((state: boolean) => !state)
		}, [communities, neighbors])

		useLayoutEffect(() => {
			setSelectedIds(selections)
		}, [selections])

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
						(d) => d.edgeCommunityId === communityId,
					)
					return { data, error: undefined }
				}
				return { data: [], error: new Error('neighbor communities not loaded') }
			},
			[neighbors],
		)

		const [minLevel, maxLevel, communityWithLevels] =
			useCommunityLevelCalculator(communities)
		const maxSize = useCommunitySizeCalculator(communities)

		const loadEntitiesByCommunity = useEntityProvider(
			communityWithLevels,
			entities,
		)

		useCommunityProvider({
			communities: communityWithLevels,
			setProviderCache,
			loadEntitiesByCommunity,
		})

		const cardOrder: ICardOrder = useMemo(() => {
			return communities.reduce((acc, c, index) => {
				const id = c.communityId
				acc[id] = index
				return acc
			}, {} as ICardOrder)
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
							toggleUpdate={forceUpdateNeighbors}
							selections={selectedIds}
							onSelectionChange={onSelectionChange}
						/>
					)
				})}
			</CardContainer>
		)
	}

const CardContainer = styled.div`
	margin: 10px 10px 10px 10px;
	overflow-y: auto;
`
