/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IEntityDetail } from '@essex-js-toolkit/hierarchy-browser'
export interface NodeData {
	id: string
	x: number
	y: number
	d: number
}

export interface EdgeData {
	source: string
	target: string
}

export interface JoinData {
	nodeId: string
	clusterId: number
	clusterLevel: number
	parentCluster?: number
}

export interface LocalEntity extends IEntityDetail {
	cid: string
}

export interface NeighborLocalEntity extends LocalEntity {
	neighbor: string
}
export interface CommunityData {
	communityId: string
	size: number
	nodes: LocalEntity[]
	edges: NeighborLocalEntity[]
	neighborSize: number
}
