/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { useState } from 'react'
import type { CommunityDataProvider } from '../../../common/dataProviders/index.js'
import { useLoadCommunitiesOnMountEffect } from '../../../hooks/useLoadEntitiesOnMountEffect.js'
import { useLoadInitialCommunities } from '../../../hooks/useLoadInitialCommunities.js'
import type { INeighborCommunityDetail } from '../../../index.js'
// import { useLoadMoreCommunitiesHandler } from '../../../hooks/useLoadMoreCommunitiesHandler'
import { useNeighborsLoadedHandler } from './useNeighborsLoadedHandler.js'

export function useAdjacentCommunityData(
	dataProvider: CommunityDataProvider,
	isOpen: boolean,
	refresh: boolean,
): [
	// neighbor communities
	INeighborCommunityDetail[],
	// isloading
	boolean,
] {
	// const [moreToLoad, setMoreToLoad] = useState(true)

	const [communities, isLoading, communitiesLoaded, handleCommunitiesLoaded] =
		useNeighborsLoadedHandler()

	const loadInitialCommunities = useLoadInitialCommunities(
		handleCommunitiesLoaded,
		dataProvider,
	)

	useLoadCommunitiesOnMountEffect(
		loadInitialCommunities,
		isOpen,
		communitiesLoaded,
		refresh,
	)

	// Wrap in AdjCommunities in Scroll to use loadmore
	// const loadMore = useLoadMoreCommunitiesHandler(
	// 	communities,
	// 	moreToLoad,
	// 	setMoreToLoad,
	// 	handleCommunitiesLoaded,
	// 	dataProvider,
	// )

	return [communities, isLoading]
}
