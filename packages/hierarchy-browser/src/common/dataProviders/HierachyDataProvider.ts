/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ILoadEntitiesAsync,
	ILoadNeighborCommunitiesAsync,
	INeighborCommunityDetail,
	ICommunityDetail,
	IEntityDetail,
	ILoadParams,
	IHierarchyNeighborResponse,
	IHierarchyDataResponse,
} from '../..'
import {
	getStaticEntities,
	getStaticNeighborEntities,
	createEntityMap,
	isEntitiesAsync,
	addLevelLabels,
} from '../../utils/utils'
import { ENTITY_TYPE, ICommunity, IEntityMap } from '../types/types'

export class HierarchyDataProvider {
	private _loadEntitiesAsync = false
	private _entities: IEntityMap | undefined
	private _asyncEntityLoader: ILoadEntitiesAsync | undefined
	private _neighbors: INeighborCommunityDetail[] | undefined
	private _communities: ICommunity[] = []

	/**
	 * update communities properties and saved reference in data manager
	 * @param {ICommunityDetail[]} entities - communities parameter from API
	 */
	public updateCommunities(communities: ICommunityDetail[]): void {
		this._communities = addLevelLabels(communities)
	}

	/**
	 * check if async loader, data array or undefined
	 * @param {IEntityDetail[] | ILoadEntitiesAsync | undefined} entities - entities parameter from API
	 */
	public updateEntities(entities?: IEntityDetail[] | ILoadEntitiesAsync): void {
		if (entities) {
			this.initEntitiesByLoadType(entities)
		}
	}
	private initEntitiesByLoadType(
		entities?: IEntityDetail[] | ILoadEntitiesAsync,
	): void {
		const shouldLoadEntitiesAsync = isEntitiesAsync(entities)
		this._loadEntitiesAsync = shouldLoadEntitiesAsync

		// store entities for static loading
		if (!shouldLoadEntitiesAsync) {
			this._entities = createEntityMap(entities as IEntityDetail[])
		} else {
			// store callback
			this._asyncEntityLoader = entities as ILoadEntitiesAsync
		}
	}

	// #region Getters/Setters
	public get asyncEntityLoader(): ILoadEntitiesAsync | undefined {
		return this._asyncEntityLoader
	}

	public get loadEntitiesAsync(): boolean {
		return this._loadEntitiesAsync
	}
	public get communities(): ICommunity[] {
		return this._communities
	}

	public set entities(entities: IEntityMap | undefined) {
		this._entities = entities
	}

	public set neighbors(neighbors: INeighborCommunityDetail[] | undefined) {
		this._neighbors = neighbors
	}
	// #endregion

	/**
	 * Callback to retrieve neighbor community data either async or static
	 * @param {ILoadParams} params - parameters to fetch (communityId, window size, filtered, level)
	 * @returns {Promise} Promise<IHierarchyNeighborResponse> containing neighbor communities
	 */
	public async getNeighborsAtLevel(
		params: ILoadParams,
		communityId: string,
		neighborLoader:
			| ILoadNeighborCommunitiesAsync
			| INeighborCommunityDetail[]
			| undefined,
	): Promise<IHierarchyNeighborResponse> {
		if (neighborLoader) {
			const isAsync = isEntitiesAsync(neighborLoader)
			if (isAsync) {
				const loader = neighborLoader as ILoadNeighborCommunitiesAsync
				return await loader(params)
			}
			const neighbors = neighborLoader as INeighborCommunityDetail[]
			const data = neighbors.filter(d => d.edgeCommunityId === communityId)
			return { data, error: undefined }
		}
		return { data: [], error: new Error('neighbor communities not loaded') }
	}

	/**
	 * Retrieve static entities (either neighbor or community entities)
	 * @param {ILoadParams} params - parameters to fetch (communityId, window size, filtered, level)
	 * @param {ENTITY_TYPE} type - type of entity (neighbor or entity)
	 * @returns {IHierarchyDataResponse} object containing data of entities and error (if applicable)
	 */
	public getEntities(
		loadParams: ILoadParams,
		type?: ENTITY_TYPE,
	): IHierarchyDataResponse {
		const { filtered, level, communityId } = loadParams
		const entityMap = this._entities
		if (type === ENTITY_TYPE.NEIGHBOR) {
			if (entityMap && this._neighbors) {
				const data = getStaticNeighborEntities(
					this._neighbors,
					entityMap,
					communityId,
				)
				return { data, error: undefined }
			}
		} else {
			if (entityMap && this._communities) {
				const data = getStaticEntities(
					this._communities,
					entityMap,
					level,
					filtered,
					communityId,
				)
				return { data, error: undefined }
			}
		}
		return { data: [], error: new Error('No static entities loaded') }
	}
}
