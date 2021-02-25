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
