/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	EntityId,
	IEntityDetail,
	IHierarchyDataResponse,
	ILoadParams,
} from '../../index.js'
import type { ENTITY_TYPE } from '../types/types.js'

export type LoadEntitiesCallback = (
	params: ILoadParams,
	entity: ENTITY_TYPE,
) => Promise<IHierarchyDataResponse | undefined>

export class EntityDataProvider {
	// all entities currently loaded
	private _entities: IEntityDetail[] = []
	// entities actually visible on screen
	private _displayEntities: IEntityDetail[] = []
	private _filteredIds = new Set<EntityId>()
	private _entityType: ENTITY_TYPE
	private _size?: number
	private _loadEntitiesFromProvider?: LoadEntitiesCallback

	constructor(
		entityType: ENTITY_TYPE,
		size: number,
		handleLoading?: LoadEntitiesCallback,
	) {
		this._size = size === -1 ? undefined : size
		this._entityType = entityType
		this._loadEntitiesFromProvider = handleLoading
	}

	public clearDisplay(): void {
		this._displayEntities = []
	}

	private clearFilteredMap(): void {
		this._filteredIds.clear()
	}

	public clear(): void {
		this.clearDisplay()
		this.clearFilteredMap()
		this.clearEntities()
	}

	public set size(s: number | undefined) {
		this._size = s === undefined || s === -1 ? undefined : s
	}
	public get size(): number | undefined {
		return this._size
	}

	private clearEntities(): void {
		this._entities = []
	}
	public get entities(): IEntityDetail[] {
		return this._entities
	}
	private addToEntitiesArray(entities: IEntityDetail[]): void {
		this._entities = this._entities.concat(entities)
	}
	public get displayEntities(): IEntityDetail[] {
		return this._displayEntities
	}

	public set displayEntities(display: IEntityDetail[]) {
		this._displayEntities = display
	}

	public set loadEntitiesFromProvider(value: LoadEntitiesCallback) {
		this._loadEntitiesFromProvider = value
	}

	private getFilterEntitiesFromCache(): IEntityDetail[] {
		return this._entities.filter(e => this._filteredIds.has(e.id))
	}

	private async loadItemsAsync(
		params: ILoadParams,
	): Promise<IEntityDetail[] | undefined> {
		if (this._loadEntitiesFromProvider) {
			const nextNodes = await this._loadEntitiesFromProvider(
				params,
				this._entityType,
			)
			if (nextNodes?.error || nextNodes?.data) {
				if (!nextNodes.error && nextNodes.data) {
					const data = nextNodes.data.filter(d => d)
					return data
				}
				throw nextNodes.error
			}
		}
		throw new Error('missing load entities callback')
	}

	private async loadAndSaveItems(
		params: ILoadParams,
	): Promise<IEntityDetail[] | undefined> {
		const filtered = params.filtered
		// get data from either provider or async and cache ids if filtered
		const data = await this.loadItemsAsync(params)
		if (data) {
			if (filtered) {
				//store ids in map
				this._filteredIds = new Set(data.map(d => d.id))
			} else {
				this.addToEntitiesArray(data)
			}
		}
		return data
	}

	private async loadItems(
		params: ILoadParams,
		maxSize?: number,
	): Promise<IEntityDetail[]> {
		const { count, filtered, offset } = params
		const totalLength = count + offset
		const size = this._size || maxSize
		if (filtered) {
			if (
				this._filteredIds.size > 0 &&
				this._filteredIds.size <= totalLength &&
				this._entities.length > 0
			) {
				const filterEntities = this.getFilterEntitiesFromCache()
				this.displayEntities = filterEntities
			} else {
				const items = await this.loadAndSaveItems(params)
				if (items) {
					this.displayEntities = items
				}
			}
		} else {
			// do we need to get more?
			if (this._entities.length < totalLength) {
				if (size && this._entities.length < size) {
					await this.loadAndSaveItems(params)
				}
			}
			this.displayEntities = this._entities
		}
		const slice = [...this._displayEntities].slice(
			params.offset,
			params.count + params.offset,
		)
		return slice
	}

	public async getCommunityMembers(
		params: ILoadParams,
		maxSize?: number,
	): Promise<IEntityDetail[]> {
		try {
			if (maxSize) {
				// set size for neighbors on selection
				this._size = maxSize
			}
			// Get next nodes to load
			const entities = await this.loadItems(params, maxSize)
			return entities || []
		} catch (e) {
			throw Error(
				`Error: There is an issue loading entities for level ${params.level}, community ${params.communityId}`,
			)
		}
	}
}
