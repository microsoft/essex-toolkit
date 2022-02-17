/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo } from 'react'
import {
	ILoadParams,
	IHierarchyDataResponse,
	IEntityDetail,
	ILoadEntitiesAsync,
} from '../../../index.js'
import { INeighborCommunityDetail } from '../../../types/index.js'
import {
	createEntityMap,
	getStaticEntities,
	isEntitiesAsync,
} from '../../../utils/utils.js'
import {
	ENTITY_TYPE,
	ICommunitiesAsyncHook,
	ICommunity,
	IEntityCounter,
	IEntityMap,
} from '../../types/index.js'

export const useEntityProvider = (
	communities: ICommunity[],
	entities?: IEntityDetail[] | ILoadEntitiesAsync,
): ICommunitiesAsyncHook => {
	const isAsync = useMemo(() => isEntitiesAsync(entities), [entities])

	const entityMap = useMemo((): IEntityMap | undefined => {
		if (!isAsync) {
			return createEntityMap(entities as IEntityDetail[])
		}
	}, [isAsync, entities])
	const getEntitiesAsync = useCallback(
		async (loadParams: ILoadParams) => {
			return await (entities as ILoadEntitiesAsync)(loadParams)
		},
		[entities],
	)

	const getStaticNeighborEntities = useCallback(
		(
			communities: INeighborCommunityDetail[],
			entityMap: IEntityMap,
			community: string,
		): IEntityDetail[] => {
			const levelIds = communities.reduce(
				(acc, d) => {
					if (d.entityIds && d.communityId === community) {
						acc.current = acc.current.concat(d.entityIds)
					}
					return acc
				},
				{ current: [] } as IEntityCounter,
			)
			return levelIds.current.reduce((acc: IEntityDetail[], id: string) => {
				const entity = entityMap[`${id}`]
				if (entity) {
					acc.push(entity)
				}
				return acc
			}, [] as IEntityDetail[])
		},
		[],
	)

	const getStaticNeighbor = useCallback(
		(communityId: string, neighborCommunities: INeighborCommunityDetail[]) => {
			if (entityMap && neighborCommunities.length > 0) {
				const data: IEntityDetail[] = getStaticNeighborEntities(
					neighborCommunities,
					entityMap,
					communityId,
				)
				return { data }
			}
			return {
				error: new Error('No static neighbor entities loaded'),
			}
		},
		[entityMap, getStaticNeighborEntities],
	)

	const getCommunityEntities = useCallback(
		(filtered: boolean, level: number, communityId: string) => {
			if (entityMap && communities) {
				const data = getStaticEntities(
					communities,
					entityMap,
					level,
					filtered,
					communityId,
				)
				return { data }
			}
			return { error: new Error('No static entities loaded') }
		},
		[communities, entityMap],
	)

	/**
	 * Retrieve static entities (either neighbor or community entities)
	 * @param {ILoadParams} params - parameters to fetch (communityId, window size, filtered, level)
	 * @param {ENTITY_TYPE} type - type of entity (neighbor or entity)
	 * @returns {IHierarchyDataResponse} object containing data of entities and error (if applicable)
	 */
	const getStaticEntitiesByType = useCallback(
		(
			loadParams: ILoadParams,
			neighborCommunities: INeighborCommunityDetail[],
			type?: ENTITY_TYPE,
		): IHierarchyDataResponse => {
			const { filtered, level, communityId } = loadParams
			if (type === ENTITY_TYPE.NEIGHBOR) {
				return getStaticNeighbor(communityId, neighborCommunities)
			}
			return getCommunityEntities(filtered, level, communityId)
		},
		[getStaticNeighbor, getCommunityEntities],
	)

	const loadEntitiesByCommunity: ICommunitiesAsyncHook = useCallback(
		async (
			loadParams: ILoadParams,
			neighborCommunities: INeighborCommunityDetail[],
			type?: ENTITY_TYPE,
		) => {
			if (isAsync) {
				return await getEntitiesAsync(loadParams)
			}
			return await getStaticEntitiesByType(
				loadParams,
				neighborCommunities,
				type,
			)
		},
		[getStaticEntitiesByType, isAsync, getEntitiesAsync],
	)

	return loadEntitiesByCommunity
}
