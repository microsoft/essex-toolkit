/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	EntityId,
	ICommunityDetail,
	IEntityDetail,
	IHierarchyDataResponse,
	ILoadParams,
	INeighborCommunityDetail,
} from '../../index.js'
import type { CommunityDataProvider } from '../dataProviders/index.js'

export interface ICommunity extends ICommunityDetail {
	level: number
}

export interface INeighbor extends INeighborCommunityDetail {
	level: number
}

export interface IEntityMap {
	[id: string]: IEntityDetail
}
export enum ENTITY_TYPE {
	ENTITY = 'entity',
	NEIGHBOR = 'neighbor',
}

export interface IDataProvidersCache {
	[id: string]: CommunityDataProvider
}

export interface ICardOrder {
	[id: string]: number
}

export type ICommunitiesAsyncHook = (
	params: ILoadParams,
	neighbors: INeighborCommunityDetail[],
	type?: ENTITY_TYPE,
) => Promise<IHierarchyDataResponse>

export interface IEntityCounter {
	current: EntityId[]
	next?: EntityId[]
}
