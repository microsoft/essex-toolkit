/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	CommunityId,
	INeighborCommunityDetail,
	ICommunityDetail,
	ILoadParams,
	IHierarchyDataResponse,
	IEntityDetail,
	ILoadNeighborCommunities,
} from '../..'
import { ENTITY_TYPE } from '../types/types'
import { EntityDataProvider } from './EntityDataProvider'
import { HierarchyDataProvider } from './HierachyDataProvider'

export const DEFAULT_LOAD_COUNT = 100

export class CommunityDataProvider {
	private _loadCount = DEFAULT_LOAD_COUNT
	private _community: CommunityId = ''
	private _neigborCommunities: INeighborCommunityDetail[] = []
	private _size = 0
	private _level = 0
	private _filterEntitiesFlag = false
	private _loadNeighborsCallback?: ILoadNeighborCommunities
	private _neighborEntitiesProvider: EntityDataProvider
	private _entityProvider: EntityDataProvider

	constructor(
		communityData: ICommunityDetail,
		hierachyDataProvider: HierarchyDataProvider,
		level: number,
	) {
		this.updateCommunityData(communityData)
		this._level = level
		const callback = this.useHierarchyDataProvider(hierachyDataProvider)
		this._loadNeighborsCallback = hierachyDataProvider.getNeighborsAtLevel
		this._entityProvider = new EntityDataProvider(
			ENTITY_TYPE.ENTITY,
			this._size,
			callback,
		)
		this._neighborEntitiesProvider = new EntityDataProvider(
			ENTITY_TYPE.NEIGHBOR,
			-1,
			callback,
		)
		this.setFilterEntities(false)
	}

	public updateCommunityData(communityData: ICommunityDetail) {
		this._community = communityData.communityId
		if (communityData.entityIds) {
			this._size = communityData.entityIds.length
		} else {
			this._size = communityData.size || 0
		}
	}

	public get loadNeighborsCallback(): ILoadNeighborCommunities | undefined {
		return this._loadNeighborsCallback
	}
	public set loadNeighborsCallback(cb: ILoadNeighborCommunities | undefined) {
		this._loadNeighborsCallback = cb
	}
	public updateHierarchyDataProvider(
		hierachyDataProvider: HierarchyDataProvider,
	) {
		const callback = this.useHierarchyDataProvider(hierachyDataProvider)
		this._loadNeighborsCallback = hierachyDataProvider.getNeighborsAtLevel
		this._entityProvider = new EntityDataProvider(
			ENTITY_TYPE.ENTITY,
			this._size,
			callback,
		)
		this._neighborEntitiesProvider = new EntityDataProvider(
			ENTITY_TYPE.NEIGHBOR,
			-1,
			callback,
		)
	}

	private useHierarchyDataProvider(
		hierachyDataProvider: HierarchyDataProvider,
	): (
		params: ILoadParams,
		type?: ENTITY_TYPE,
	) => Promise<IHierarchyDataResponse | undefined> {
		const getEntitiesfromProvider = (params: ILoadParams, type?: ENTITY_TYPE) =>
			this.getEntities(hierachyDataProvider, params, type)
		return getEntitiesfromProvider
	}

	public async getEntities(
		hierarchyProvider: HierarchyDataProvider,
		params: ILoadParams,
		type?: ENTITY_TYPE,
	): Promise<IHierarchyDataResponse | undefined> {
		if (hierarchyProvider.asyncEntityLoader) {
			return await hierarchyProvider.asyncEntityLoader(params)
		} else {
			return hierarchyProvider.getEntities(params, type)
		}
	}

	public setFilterEntities(filterEntities: boolean): void {
		this._filterEntitiesFlag = filterEntities
		this._entityProvider.clearDisplay()
	}

	public clearNeighborEdges(): void {
		this._neighborEntitiesProvider.clear()
	}
	public set level(level: number) {
		this._level = level
	}
	public get level(): number {
		return this._level
	}

	public get size(): number {
		return this._size
	}

	public get communityId(): CommunityId {
		return this._community
	}

	private addToNeighborCommunitiesArray(
		communities: INeighborCommunityDetail[],
	): void {
		this._neigborCommunities = this._neigborCommunities.concat(communities)
	}

	private async loadNeighborsAsync(
		params: ILoadParams,
	): Promise<INeighborCommunityDetail[] | undefined> {
		if (this._loadNeighborsCallback) {
			const nextNeighbors = await this._loadNeighborsCallback(
				params,
				this._community,
			)
			if (!nextNeighbors.error && nextNeighbors.data) {
				const data = nextNeighbors.data.filter(d => d)
				this.addToNeighborCommunitiesArray(data)
				return data
			} else {
				throw nextNeighbors.error
			}
		}
	}

	public async getAdjacentCommunities(
		offset: number,
		pageSize?: number,
	): Promise<INeighborCommunityDetail[] | undefined> {
		const loadCount = pageSize || this._loadCount
		const params = {
			communityId: this._community,
			level: this._level,
			count: loadCount,
			offset: offset,
			filtered: this._filterEntitiesFlag,
		}
		try {
			const nextNeghbors = this.loadNeighborsAsync(params)
			return nextNeghbors || []
		} catch (err) {
			throw Error(
				`Error: There is an issue loading neighbors for level ${this._level}, community ${this._community}`,
			)
		}
	}

	public async getCommunityMembers(
		offset: number,
		pageSize?: number,
		community?: CommunityId,
		filtered?: boolean,
		entityType?: ENTITY_TYPE,
		max?: number,
	): Promise<IEntityDetail[]> {
		const loadCount = pageSize || this._loadCount
		const communityId = community !== undefined ? community : this._community
		const filteredFlag =
			filtered !== undefined ? filtered : this._filterEntitiesFlag
		const params = {
			communityId,
			level: this._level,
			count: loadCount,
			offset: offset,
			filtered: filteredFlag,
		}
		let provider: EntityDataProvider = this._entityProvider
		if (entityType && entityType === ENTITY_TYPE.NEIGHBOR) {
			provider = this._neighborEntitiesProvider
		}
		return await provider.getCommunityMembers(params, max || this._size)
	}
}
