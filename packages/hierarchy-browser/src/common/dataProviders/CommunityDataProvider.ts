/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	CommunityId,
	INeighborCommunityDetail,
	ICommunityDetail,
	ILoadParams,
	IEntityDetail,
	ILoadNeighborCommunities,
	IHierarchyDataResponse,
} from '../..'
// import {  useHierarchyDataProvider } from '../../utils/utils'
import { ENTITY_TYPE } from '../types/types'
import { EntityDataProvider } from './EntityDataProvider'
import { HierarchyDataProvider } from './HierachyDataProvider'

export const DEFAULT_LOAD_COUNT = 100

export class CommunityDataProvider {
	private _community: CommunityId = ''
	private _neighborSize = -1
	private _neighborCommunities: INeighborCommunityDetail[] = []
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
			this._neighborSize,
			callback,
		)
		this.setFilterEntities(false)
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

	private async getEntities(
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

	public updateCommunityData(communityData: ICommunityDetail): void {
		this._community = communityData.communityId
		this._size = communityData.entityIds?.length || communityData.size
		this._neighborSize = communityData.neighborSize || -1
	}

	public updateHierarchyDataProvider(
		hierachyDataProvider: HierarchyDataProvider,
	): void {
		const callback = this.useHierarchyDataProvider(hierachyDataProvider)
		this._loadNeighborsCallback = hierachyDataProvider.getNeighborsAtLevel
		this._entityProvider.size = this._size
		this._entityProvider.loadEntitiesFromProvider = callback
		this._neighborEntitiesProvider.loadEntitiesFromProvider = callback
	}

	public setFilterEntities(filterEntities: boolean): void {
		this._filterEntitiesFlag = filterEntities
		this._entityProvider.clearDisplay()
	}

	public clearNeighborEdges(): void {
		this._neighborEntitiesProvider.clear()
	}

	// <--- Getters/Setters --->
	public get loadNeighborsCallback(): ILoadNeighborCommunities | undefined {
		return this._loadNeighborsCallback
	}
	public set loadNeighborsCallback(cb: ILoadNeighborCommunities | undefined) {
		this._loadNeighborsCallback = cb
	}

	public set level(level: number) {
		this._level = level
	}
	public get level(): number {
		return this._level
	}
	public set neighborSize(size: number) {
		this._neighborSize = size
	}
	public get neighborSize(): number {
		return this._neighborSize
	}

	public get size(): number {
		return this._size
	}

	public get communityId(): CommunityId {
		return this._community
	}
	// <--- Getters/Setters --->
	private addToNeighborCommunitiesArray(
		communities: INeighborCommunityDetail[],
	): void {
		this._neighborCommunities = this._neighborCommunities.concat(communities)
	}

	private async loadNeighborsAsync(
		params: ILoadParams,
	): Promise<INeighborCommunityDetail[] | undefined> {
		// if already init neighbors, return stored communities
		if (this._neighborCommunities.length > 0 && params.offset === 0) {
			return this._neighborCommunities
		}
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

	// <--- Load Neighbor Community Data --->
	public async getAdjacentCommunities(
		offset: number,
		pageSize?: number,
	): Promise<INeighborCommunityDetail[] | undefined> {
		const loadCount = pageSize || DEFAULT_LOAD_COUNT

		const params = {
			communityId: this._community,
			level: this._level,
			count: loadCount,
			offset: offset,
			filtered: this._filterEntitiesFlag,
		}
		try {
			const nextNeighbors = this.loadNeighborsAsync(params)
			return nextNeighbors || []
		} catch (err) {
			console.warn(err)
			throw Error(
				`Error: There is an issue loading neighbors for level ${this._level}, community ${this._community}`,
			)
		}
	}
	// <--- Load Neighbor Community Data --->

	// <--- Load entities from community or neighbors --->
	public async getCommunityMembers(
		offset: number,
		pageSize?: number,
		community?: CommunityId,
		filtered?: boolean,
		entityType?: ENTITY_TYPE,
		max?: number,
	): Promise<IEntityDetail[]> {
		const loadCount = pageSize || DEFAULT_LOAD_COUNT
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
	// <--- Load entities from community or neighbors --->
}
