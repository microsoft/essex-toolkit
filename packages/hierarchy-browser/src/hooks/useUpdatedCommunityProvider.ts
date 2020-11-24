/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo, useEffect } from 'react'
import { CommunityDataProvider } from '../common/dataProviders'
import { HierarchyDataProvider } from '../common/dataProviders/HierachyDataProvider'
import { ICommunityDetail, ILoadNeighborCommunities } from '../types'

export function useUpdatedCommunityProvider(
	hierachyDataProvider: HierarchyDataProvider,
	community: ICommunityDetail,
	level: number,
	neighborCallback?: ILoadNeighborCommunities,
	dataProvider?: CommunityDataProvider,
) {
	useEffect(() => {
		if (dataProvider) {
			dataProvider.updateCommunityData(community)
			dataProvider.updateHierarchyDataProvider(hierachyDataProvider)
		}
	}, [community, hierachyDataProvider])

	useEffect(() => {
		if (dataProvider) {
			dataProvider.loadNeighborsCallback = neighborCallback
		}
	}, [neighborCallback])

	useMemo(() => {
		if (dataProvider) {
			dataProvider.level = level
		}
	}, [level, dataProvider])
}
