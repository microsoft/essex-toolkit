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
	CommunityId,
} from '../..'
import { getStaticEntities, getStaticNeighborEntities } from '../../utils/utils'
import { ENTITY_TYPE, ICommunity, IEntityMap } from '../types/types'

export class HierarchyDataProvider {
	private _loadEntitiesAsync = false
	private _loadNeighborsAsync = false
	private _entities: IEntityMap | undefined
	private _asyncEntityLoader: ILoadEntitiesAsync | undefined
	private _asyncNeighborLoader: ILoadNeighborCommunitiesAsync | undefined
	private _neighbors: INeighborCommunityDetail[] | undefined
	private _communities: ICommunity[] = []

	constructor(
		communities: ICommunityDetail[],
		entities?: IEntityDetail[] | ILoadEntitiesAsync,
		neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync,
	) {
		this._communities = this.addLevelLabels(communities)
		if (entities) {
			this.initEntitiesByLoadType(entities)
		}
		if (neighbors) {
			this.initNeighborsByLoadType(neighbors)
		}
	}

	private initNeighborsByLoadType(
		communities: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync,
	): void {
		const shouldLoadEntitiesAsync = this.isEntitiesAsync(communities)
		if (!shouldLoadEntitiesAsync) {
			this._neighbors = communities as INeighborCommunityDetail[]
		} else {
			// store callback
			this._asyncNeighborLoader = communities as ILoadNeighborCommunitiesAsync
		}
		this._loadNeighborsAsync = shouldLoadEntitiesAsync
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
	public get loadNeighborsAsync(): boolean {
		return this._loadNeighborsAsync
	}

	public set entities(entities: IEntityMap | undefined) {
		this._entities = entities
	}

	public set neighbors(neighbors: INeighborCommunityDetail[] | undefined) {
		this._neighbors = neighbors
	}

	public getNeighborsAtLevel(
		communityId: CommunityId,
	): INeighborCommunityDetail[] {
		if (this._neighbors) {
			return this._neighbors.filter(d => d.edgeCommunityId === communityId)
		}
		return []
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
