/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export type CommunityId = string
export type EntityId = string

export interface ICommunityDetail {
	communityId: CommunityId
	entityIds?: EntityId[] // only needed if static
	size: number
	neighborSize?: number
}

export interface INeighborCommunityDetail extends ICommunityDetail {
	connections: number
	edgeCommunityId: CommunityId
}

export interface IEntityDetail {
	id: EntityId
	attrs?: { [key: string]: string | number }
}

export interface IHierarchyDataProvider {
	getCommunityData: () => ICommunityDetail[]
}

export interface IHierarchyDataResponse {
	data: IEntityDetail[]
	error: Error | null | undefined
}

export interface IHierarchyNeighborResponse {
	data: INeighborCommunityDetail[]
	error: Error | null | undefined
}

export interface ILoadParams {
	communityId: CommunityId
	level: number
	count: number
	offset: number
	filtered: boolean
}

export interface ILoadEntitiesAsync {
	(params: ILoadParams): Promise<IHierarchyDataResponse>
}

export interface ILoadNeighborCommunitiesAsync {
	(params: ILoadParams): Promise<IHierarchyNeighborResponse>
}
