/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { CommunityDataProvider } from '../common/dataProviders/index.js'
import { DEFAULT_LOAD_COUNT } from '../common/dataProviders/index.js'
import type { IEntityDetail } from '../index.js'
import type { IEntityLoadParams } from './useLoadMoreEntitiesHandler.js'

export function useLoadInitialEntitiesHandler(
	handleEntitiesLoaded: (
		entities: IEntityDetail[],
		error?: Error | undefined | string,
	) => void,
	isEntitiesLoading: boolean,
	dataProvider?: CommunityDataProvider,
): (page?: number, params?: IEntityLoadParams) => void {
	return useCallback(
		(page?: number, params?: IEntityLoadParams) => {
			if (dataProvider === undefined) {
				console.warn('No CommunityDataProvider loaded')
				return
			}
			if (isEntitiesLoading) {
				return
			}
			dataProvider
				.getCommunityMembers(
					0,
					DEFAULT_LOAD_COUNT,
					params?.communityId,
					params?.filtered,
					params?.type,
					params?.max,
				)
				.then(data => handleEntitiesLoaded(data, undefined))
				.catch(err => {
					console.warn(`error loading initial entities: ${err}`)
					handleEntitiesLoaded([], err)
				})
		},
		[dataProvider, handleEntitiesLoaded, isEntitiesLoading],
	)
}
