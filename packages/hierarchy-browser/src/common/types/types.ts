/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ICommunityDetail,
	INeighborCommunityDetail,
	IEntityDetail,
} from '../..'
import { CommunityDataProvider } from '../dataProviders'

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
