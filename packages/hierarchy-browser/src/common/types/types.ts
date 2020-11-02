/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ICommunityDetail,
	INeighborCommunityDetail,
	IEntityDetail,
} from '../..'

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
