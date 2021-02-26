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
import { ENTITY_TYPE, ICommunitiesAsyncHook } from '../types/types'
import { EntityDataProvider } from './EntityDataProvider'

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

	private _forceUpdateNeighbors: boolean = false

	constructor(
		communityData: ICommunityDetail,
		loadEntitiesCallback: ICommunitiesAsyncHook,
		level: number,
	) {
		this.updateCommunityData(communityData)
		this._level = level
		const callback = this.useEntityHandler(loadEntitiesCallback)
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
	private useEntityHandler(
		loadEntitiesCallback: ICommunitiesAsyncHook,
	): (
		params: ILoadParams,
		type?: ENTITY_TYPE,
	) => Promise<IHierarchyDataResponse | undefined> {
		const getEntitiesfromProvider = (params: ILoadParams, type?: ENTITY_TYPE) =>
			loadEntitiesCallback(params, this._neighborCommunities, type)
		return getEntitiesfromProvider
	}

	public updateCommunityData(communityData: ICommunityDetail): void {
		this._community = communityData.communityId
		this._size = communityData.entityIds?.length || communityData.size
		this._neighborSize = communityData.neighborSize || -1
	}

	public updateEntityLoader(loadEntitiesCallback: ICommunitiesAsyncHook): void {
		const callback = this.useEntityHandler(loadEntitiesCallback)
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

	// #region Getters/Setters
	public get loadNeighborsCallback(): ILoadNeighborCommunities | undefined {
		return this._loadNeighborsCallback
	}
	public set loadNeighborsCallback(cb: ILoadNeighborCommunities | undefined) {
		this._loadNeighborsCallback = cb
	}

	public set forceUpdateNeighbors(state: boolean) {
		this._forceUpdateNeighbors = state
	}
	public get forceUpdateNeighbors(): boolean {
		return this._forceUpdateNeighbors
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
	// #endregion
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
				// const data = nextNeighbors.data.filter(d => d)
				this.addToNeighborCommunitiesArray(nextNeighbors.data)
				return nextNeighbors.data
			} else {
				throw nextNeighbors.error
			}
		}
	}
	// #region Load Neighbor Communities
	/**
	 * Fetches neighbor communities (either synchronously or async) in a given window.
	 * @param {number} offset - offset to start array slice
	 * @param {number} pageSize - optional number of communities to fetch, defaulted to 100.
	 * @returns {Promise} Promise<INeighborCommunityDetail[] | undefined> returns communities if available
	 */
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
	// #endregion
	// #region Load Neighbor Communities
	/**
	 * Fetches entites (either neighbors or community) communities (either synchronously or async) in a given window from EntityProvider.
	 * @param {number} offset - offset to start array slice
	 * @param {number} pageSize - optional number of communities to fetch, defaulted to 100.
	 * @param {CommunityId} community - id of the community
	 * @param {boolean} filtered - should result be filtered
	 * @param {ENTITY_TYPE} entityType - type of entity (neighbor or entity), default to entity
	 * @param {number} max - set size for neighbors on selection
	 * @returns {Promise} Promise<IEntityDetail[]> returns entities
	 */
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
	// #endregion
}
