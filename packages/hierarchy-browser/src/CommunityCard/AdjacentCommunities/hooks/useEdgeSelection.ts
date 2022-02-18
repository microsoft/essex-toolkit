/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'
import { CommunityDataProvider } from '../../../common/dataProviders/index.js'
import { ENTITY_TYPE } from '../../../common/types/index.js'
import { useEntitiesLoadedHandler } from '../../../hooks/useEntitiesLoadedHandler.js'
import { useLoadInitialEntitiesHandler } from '../../../hooks/useLoadInitialEntitiesHandler.js'
import {
	IEntityLoadParams,
	useLoadMoreEntitiesHandler,
} from '../../../hooks/useLoadMoreEntitiesHandler.js'
import { INeighborCommunityDetail, IEntityDetail } from '../../../index.js'

export function useEdgeSelection(dataProvider?: CommunityDataProvider): [
	// setEdgeSelection
	(edge: INeighborCommunityDetail | undefined) => Promise<void>,
	// loadMoreEntities
	(
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined,
	// moreEntitiesToLoad
	boolean,
	// entities
	IEntityDetail[],
	// selectedCommunityEdge
	INeighborCommunityDetail | undefined,
	// clearCurrentSelection
	() => Promise<void>,
] {
	const [selectedCommunityEdge, setSelectedCommunityEdge] = useState<
		INeighborCommunityDetail | undefined
	>()
	const [moreEntitiesToLoad, setMoreEntitiesToLoad] = useState(true)

	const [entities, handleEntitiesLoaded, clearEntities, setLoading, isLoading] =
		useEntitiesLoadedHandler(false)

	const loadMoreEntities = useLoadMoreEntitiesHandler(
		entities,
		moreEntitiesToLoad,
		setMoreEntitiesToLoad,
		handleEntitiesLoaded,
		dataProvider,
	)

	const loadInitialEntities = useLoadInitialEntitiesHandler(
		handleEntitiesLoaded,
		isLoading,
		dataProvider,
	)

	const loadMoreOnScroll = useCallback(
		async (
			pageNumber?: number,
			params?: IEntityLoadParams,
		): Promise<IEntityDetail[]> => {
			if (selectedCommunityEdge) {
				const defaultParams = {
					communityId: selectedCommunityEdge.communityId,
					filtered: false,
					type: ENTITY_TYPE.NEIGHBOR,
				}
				const result = await loadMoreEntities(
					undefined,
					params || defaultParams,
				)
				return result || []
			}
			return []
		},
		[loadMoreEntities, selectedCommunityEdge],
	)

	const clearCurrentSelection = useCallback(async () => {
		setMoreEntitiesToLoad(true)
		clearEntities(true)
		setLoading(false)
		dataProvider && dataProvider.clearNeighborEdges()
	}, [clearEntities, setMoreEntitiesToLoad, setLoading, dataProvider])

	const setEdgeSelection = useCallback(
		async (edge?: INeighborCommunityDetail) => {
			setSelectedCommunityEdge(edge)
			if (edge) {
				const params = {
					offset: 0,
					communityId: edge.communityId,
					filtered: false,
					type: ENTITY_TYPE.NEIGHBOR,
					max: edge.size,
				} as IEntityLoadParams
				dataProvider && dataProvider.clearNeighborEdges()
				await loadInitialEntities(undefined, params)
			}
		},
		[setSelectedCommunityEdge, loadInitialEntities, dataProvider],
	)

	return [
		setEdgeSelection,
		loadMoreOnScroll,
		moreEntitiesToLoad,
		entities,
		selectedCommunityEdge,
		clearCurrentSelection,
	]
}
