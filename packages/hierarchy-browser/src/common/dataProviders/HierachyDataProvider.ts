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
import { getStaticEntities, getStaticNeighborEntities } from '../../utils/utils'
import { ENTITY_TYPE, ICommunity, IEntityMap } from '../types/types'

export class HierarchyDataProvider {
	private _loadEntitiesAsync = false
	private _entities: IEntityMap | undefined
	private _asyncEntityLoader: ILoadEntitiesAsync | undefined
	private _asyncNeighborLoader: ILoadNeighborCommunitiesAsync | undefined
	private _neighbors: INeighborCommunityDetail[] | undefined
	private _communities: ICommunity[] = []

	constructor(
		communities?: ICommunityDetail[],
		entities?: IEntityDetail[] | ILoadEntitiesAsync,
		neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync,
	) {
		this.updateCommunities(communities || [])
		this.updateEntities(entities)
		this.updateNeighbors(neighbors)
	}

	public updateCommunities(communities: ICommunityDetail[]): void {
		this._communities = this.addLevelLabels(communities)
	}

	public updateEntities(entities?: IEntityDetail[] | ILoadEntitiesAsync): void {
		if (entities) {
			this.initEntitiesByLoadType(entities)
		}
	}

	public updateNeighbors(
		neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync,
	): boolean {
		if (neighbors) {
			return this.initNeighborsByLoadType(neighbors)
		}
		return false
	}

	private initNeighborsByLoadType(
		communities: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync,
	): boolean {
		const shouldLoadEntitiesAsync = this.isEntitiesAsync(communities)
		if (!shouldLoadEntitiesAsync) {
			this._neighbors = communities as INeighborCommunityDetail[]
			if (communities.length > 0) {
				return true
			}
		} else {
			// store callback
			this._asyncNeighborLoader = communities as ILoadNeighborCommunitiesAsync
			return true
		}
		return false
	}

	private initEntitiesByLoadType(
		entities: IEntityDetail[] | ILoadEntitiesAsync,
	): void {
		const shouldLoadEntitiesAsync = this.isEntitiesAsync(entities)
		// store entities for static loading
		if (!shouldLoadEntitiesAsync) {
			this._entities = this.createEntityMap(entities as IEntityDetail[])
		} else {
			// store callback
			this._asyncEntityLoader = entities as ILoadEntitiesAsync
		}
		this._loadEntitiesAsync = shouldLoadEntitiesAsync
	}

	private isEntitiesAsync(
		entities:
			| (IEntityDetail[] | INeighborCommunityDetail[])
			| ((
					params: ILoadParams,
			  ) => Promise<IHierarchyNeighborResponse | IHierarchyDataResponse>),
	): boolean {
		if (!Array.isArray(entities) || entities instanceof Promise) {
			return true
		}
		return false
	}

	private createEntityMap(entities?: IEntityDetail[]): IEntityMap | undefined {
		if (entities) {
			return entities.reduce((acc, entity) => {
				const id = entity.id
				acc[id] = entity
				return acc
			}, {} as IEntityMap)
		}
	}

	private addLevelLabels(communities: ICommunityDetail[]): ICommunity[] {
		const max = communities.length - 1
		return communities.map((comm, index) =>
			Object.assign({}, { ...comm, level: max - index }),
		)
	}

	public get asyncEntityLoader(): ILoadEntitiesAsync | undefined {
		return this._asyncEntityLoader
	}
	public get asyncNeighborLoader(): ILoadNeighborCommunitiesAsync | undefined {
		return this._asyncNeighborLoader
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

	public async getNeighborsAtLevel(
		params: ILoadParams,
		communityId: string,
	): Promise<IHierarchyNeighborResponse> {
		if (this._asyncNeighborLoader) {
			return await this._asyncNeighborLoader(params)
		}
		if (this._neighbors) {
			const data = this._neighbors.filter(
				d => d.edgeCommunityId === communityId,
			)
			return { data, error: undefined }
		}
		return { data: [], error: new Error('neighbor communities not loaded') }
	}

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
