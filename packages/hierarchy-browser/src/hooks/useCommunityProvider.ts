/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { CommunityDataProvider } from '../common/dataProviders'
import { HierarchyDataProvider } from '../common/dataProviders/HierachyDataProvider'
import { ICardOrder, IDataProvidersCache } from '../common/types/types'
import { ICommunityDetail } from '../types/types'

interface SetCache {
	(state: IDataProvidersCache): IDataProvidersCache
}

interface ICommunityProviderHook {
	communities: ICommunityDetail[]
	setProviderCache: (state: SetCache) => void
	hierachyDataProvider: HierarchyDataProvider
	setCardOrder: (sorted: ICardOrder) => void
}

// Update and add to cache of communityProviders so when new community cards are added
// communityDataProvider is not removed
export const useCommunityProvider = ({
	communities,
	setProviderCache,
	hierachyDataProvider,
	setCardOrder,
}: ICommunityProviderHook): void => {
	useMemo(() => {
		const reverseList = [...communities].reverse()
		setProviderCache((cache: IDataProvidersCache) => {
			const communityIds = reverseList.map(c => c.communityId)
			const cacheIds = Object.keys(cache)
			const intersection = cacheIds.filter(value =>
				communityIds.includes(value),
			)
			return reverseList.reduce(
				(acc, community, index): IDataProvidersCache => {
					if (!cache[community.communityId]) {
						const provider = new CommunityDataProvider(
							community,
							hierachyDataProvider,
							index,
						)
						acc[community.communityId] = provider
						// check if its removed
					} else if (intersection.includes(community.communityId)) {
						const provider = cache[community.communityId]
						provider.updateCommunityData(community)
						provider.updateHierarchyDataProvider(hierachyDataProvider)
						acc[community.communityId] = provider
					}
					return acc
				},
				{} as IDataProvidersCache,
			)
		})
		const sortOrder = communities.reduce((acc, c, index) => {
			const id = c.communityId
			acc[id] = index
			return acc
		}, {} as ICardOrder)
		setCardOrder(sortOrder)
	}, [communities, hierachyDataProvider, setProviderCache, setCardOrder])
}
