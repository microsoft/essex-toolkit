/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo, useEffect } from 'react'
import { CommunityDataProvider } from '../common/dataProviders/index.js'
import { ILoadNeighborCommunities } from '../types/index.js'

export function useUpdatedCommunityProvider(
	dataProvider: CommunityDataProvider,
	level: number,
	neighborCallback?: ILoadNeighborCommunities,
): void {
	useEffect(() => {
		dataProvider.loadNeighborsCallback = neighborCallback
	}, [neighborCallback, dataProvider])

	useMemo(() => {
		dataProvider.level = level
	}, [level, dataProvider])
}
