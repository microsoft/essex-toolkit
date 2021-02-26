/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { useState } from 'react'
import { INeighborCommunityDetail } from '../../..'
import { CommunityDataProvider } from '../../../common/dataProviders'
import { useLoadCommunitiesOnMountEffect } from '../../../hooks/useLoadEntitiesOnMountEffect'
import { useLoadInitialCommunities } from '../../../hooks/useLoadInitialCommunities'
// import { useLoadMoreCommunitiesHandler } from '../../../hooks/useLoadMoreCommunitiesHandler'
import { useNeighborsLoadedHandler } from './useNeighborsLoadedHandler'

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

	const [
		communities,
		isLoading,
		communitiesLoaded,
		handleCommunitiesLoaded,
	] = useNeighborsLoadedHandler()

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
