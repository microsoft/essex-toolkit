/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import type { CommunityDataProvider } from '../common/dataProviders/index.js'
import { DEFAULT_LOAD_COUNT } from '../common/dataProviders/index.js'
import type { ENTITY_TYPE } from '../common/types/types.js'
import type { CommunityId, IEntityDetail } from '../index.js'

export interface IEntityLoadParams {
	communityId?: CommunityId
	filtered?: boolean
	type?: ENTITY_TYPE
	loadCount?: number
	offset?: number
	max?: number
}
export function useLoadMoreEntitiesHandler(
	entities: IEntityDetail[],
	moreToLoad: boolean,
	setMoreToLoad: (value: boolean) => void,
	handleEntitiesLoaded: (
		entities: IEntityDetail[],
		error?: Error | string | undefined,
	) => void,
	dataProvider?: CommunityDataProvider,
	isLoading?: boolean,
): (
	pageNumber?: number,
	params?: IEntityLoadParams,
	init?: boolean,
) => Promise<IEntityDetail[]> | undefined {
	const getEntities = useCallback(
		(): Promise<IEntityDetail[]> => Promise.resolve(entities),
		[entities],
	)
	return useCallback(
		(pageNumber?: number, params?: IEntityLoadParams) => {
			//pagenumber baked in with react-infinte-scroller
			const initialOffset = entities ? entities.length : 0
			const offset =
				params && params.offset !== undefined ? params.offset : initialOffset
			const loadCount =
				params && params.loadCount ? params.loadCount : DEFAULT_LOAD_COUNT
			if (!moreToLoad) {
				return getEntities()
			}
			if (isLoading) {
				return
			}
			if (dataProvider) {
				return dataProvider
					.getCommunityMembers(
						offset,
						loadCount,
						params?.communityId,
						params?.filtered,
						params?.type,
						params?.max,
					)
					.then(nodes => {
						if (nodes && nodes.length > 0) {
							const current = entities ? entities : []
							const all = [...current, ...nodes]
							if (nodes.length < DEFAULT_LOAD_COUNT) {
								setMoreToLoad(false)
							}
							handleEntitiesLoaded(all, undefined)
							return all
						} else {
							setMoreToLoad(false)
						}
						return []
					})
					.catch(err => {
						console.warn('error', err)
						setMoreToLoad(false)
						handleEntitiesLoaded([], err)
						return []
					})
			}
			console.warn('error: dataProvider was not found. Unable to load entities')
			return
		},
		[
			dataProvider,
			moreToLoad,
			setMoreToLoad,
			handleEntitiesLoaded,
			entities,
			getEntities,
			isLoading,
		],
	)
}
