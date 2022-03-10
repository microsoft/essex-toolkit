/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo } from 'react'

import type { CommunityDataProvider } from '../common/dataProviders/index.js'
import type { ILoadNeighborCommunities } from '../types/index.js'

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
