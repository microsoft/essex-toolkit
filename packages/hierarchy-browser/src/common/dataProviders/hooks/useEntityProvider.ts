import { useCallback, useMemo } from 'react'
import {
	ILoadParams,
	IHierarchyDataResponse,
	IEntityDetail,
	ILoadEntitiesAsync,
} from '../../..'
import {
	ILoadNeighborCommunitiesAsync,
	INeighborCommunityDetail,
} from '../../../types'
import {
	createEntityMap,
	getStaticEntities,
	isEntitiesAsync,
} from '../../../utils/utils'
import {
	ENTITY_TYPE,
	ICommunitiesAsyncHook,
	ICommunity,
	IEntityCounter,
	IEntityMap,
} from '../../types'

export const useEntityProvider = (
	communities: ICommunity[],
	neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync,
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
					if (d.entityIds) {
						if (d.communityId === community) {
							acc.current = acc.current.concat(d.entityIds)
						}
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

	// const getStaticNeighbor = useCallback((communityId: string)=>{
	//     if (entityMap && neighbors) {
	//         const data: IEntityDetail[] = getStaticNeighborEntities(
	//             neighbors,
	//             entityMap,
	//             communityId,
	//         )
	//         return { data, error: undefined }
	//     }
	// 	return { data: [], error: new Error('No static neighbor entities loaded') }
	// },[neighbors, entityMap])

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
				return { data, error: undefined }
			}
			return { data: [], error: new Error('No static entities loaded') }
		},
		[communities],
	)

	/**
	 * Retrieve static entities (either neighbor or community entities)
	 * @param {ILoadParams} params - parameters to fetch (communityId, window size, filtered, level)
	 * @param {ENTITY_TYPE} type - type of entity (neighbor or entity)
	 * @returns {IHierarchyDataResponse} object containing data of entities and error (if applicable)
	 */
	const getStaticEntitiesByType = useCallback(
		(loadParams: ILoadParams, type?: ENTITY_TYPE): IHierarchyDataResponse => {
			const { filtered, level, communityId } = loadParams
			if (type === ENTITY_TYPE.NEIGHBOR) {
				// return getStaticNeighbor(communityId)
			}
			return getCommunityEntities(filtered, level, communityId)
		},
		[getCommunityEntities],
	)

	const loadEntitiesByCommunity: ICommunitiesAsyncHook = useCallback(
		async (loadParams: ILoadParams, type?: ENTITY_TYPE) => {
			if (isAsync) {
				return await getEntitiesAsync(loadParams)
			}
			return await getStaticEntitiesByType(loadParams, type)
		},
		[getStaticEntitiesByType, isAsync, getEntitiesAsync],
	)

	return loadEntitiesByCommunity
}
