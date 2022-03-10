/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import { CommunityDataProvider } from '../common/dataProviders/index.js'
import type {
	ICommunitiesAsyncHook,
	ICommunity,
	IDataProvidersCache,
} from '../common/types/types.js'

interface SetCache {
	(state: IDataProvidersCache): IDataProvidersCache
}

interface ICommunityProviderHook {
	communities: ICommunity[]
	setProviderCache: (state: SetCache) => void
	loadEntitiesByCommunity: ICommunitiesAsyncHook
}

// Update and add to cache of communityProviders so when new community cards are added
// communityDataProvider is not removed
export const useCommunityProvider = ({
	communities,
	setProviderCache,
	loadEntitiesByCommunity,
}: ICommunityProviderHook): void => {
	useMemo(() => {
		setProviderCache((cache: IDataProvidersCache) => {
			const communityIds = communities.map(c => c.communityId)
			const cacheIds = Object.keys(cache)
			const intersection = cacheIds.filter(value =>
				communityIds.includes(value),
			)
			return communities.reduce((acc, community): IDataProvidersCache => {
				if (!cache[community.communityId]) {
					const provider = new CommunityDataProvider(
						community,
						loadEntitiesByCommunity,
						community.level,
					)
					acc[community.communityId] = provider
					// check if its removed
				} else if (intersection.includes(community.communityId)) {
					const provider = cache[community.communityId]
					provider.updateCommunityData(community)
					provider.updateEntityLoader(loadEntitiesByCommunity)
					acc[community.communityId] = provider
				}
				return acc
			}, {} as IDataProvidersCache)
		})
	}, [communities, setProviderCache, loadEntitiesByCommunity])
}
