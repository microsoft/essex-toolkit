/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { INeighborCommunityDetail } from '../index.js'
import {
	CommunityDataProvider,
	DEFAULT_LOAD_COUNT,
} from '../common/dataProviders/index.js'

export function useLoadInitialCommunities(
	handleCommunitiesLoaded: (
		communities: INeighborCommunityDetail[],
		error?: Error | undefined | string,
	) => void,
	dataProvider: CommunityDataProvider,
): () => void {
	return useCallback(() => {
		dataProvider
			.getAdjacentCommunities(0, DEFAULT_LOAD_COUNT)
			.then(data => handleCommunitiesLoaded(data || [], undefined))
			.catch(err => handleCommunitiesLoaded([], err))
	}, [dataProvider, handleCommunitiesLoaded])
}
