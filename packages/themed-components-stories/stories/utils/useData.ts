import { useState, useEffect, useMemo } from 'react'
import { EdgeData, JoinData, NodeData } from './types'
import { CSVToArray, search } from './utils'

export interface CommunityData {
	communityId: string
	size: number
	nodes: any[]
	edges: any[]
	neighborSize: number
}

const selectedClusterID = 204
export function useData(): [any[], any[], any[], any] {
	const [nodes, setNodes] = useState<NodeData[] | undefined>()
	const [edges, setEdges] = useState<EdgeData[] | undefined>()
	const [join, setJoin] = useState<JoinData[] | undefined>()

	const loadRemoteData = async (url: string, setFunc: (d: any[]) => void) => {
		const resp = await fetch(url)
		const data = await resp.text()
		const parsedData = CSVToArray(data, ',')
		const header = parsedData[0]
		const sliced = parsedData.slice(1)
		const mappedValues: any[] = sliced.map(arr => {
			const obj = header.reduce((accum, colName, index) => {
				let value: string | number = arr[index]
				value = isNaN(+value) ? value : +value
				accum = Object.assign({}, { ...accum, [colName]: value })
				return accum
			}, {} as any)
			return obj
		})
		setFunc(mappedValues)
	}

	const clusterIdMap = useMemo(() => {
		if (join) {
			return join.reduce((acc: { [x: string]: JoinData[] }, d: JoinData) => {
				if (acc[`${d.clusterId}`]) {
					acc[`${d.clusterId}`] = [...acc[`${d.clusterId}`], d]
				} else {
					acc[`${d.clusterId}`] = [d]
				}

				return acc
			}, {})
		}
	}, [join])

	const selectedJoin = useMemo((): JoinData[][] | undefined => {
		if (clusterIdMap) {
			return search([`${selectedClusterID}`], clusterIdMap)
		}
	}, [clusterIdMap])

	const communityMap = useMemo((): { [x: string]: JoinData } | undefined => {
		if (join) {
			return join.reduce((acc: { [x: string]: JoinData }, d: JoinData) => {
				if (acc[`${d.nodeId}`]) {
					acc[`${d.nodeId}`] = d
				} else {
					acc[`${d.nodeId}`] = d
				}

				return acc
			}, {})
		}
	}, [join])

	const nodeMap = useMemo(() => {
		if (nodes) {
			return nodes.reduce((acc: { [x: string]: NodeData }, d: NodeData) => {
				const id = d.id
				acc[id] = d
				return acc
			}, {})
		}
	}, [nodes])

	const edgeMap = useMemo(() => {
		if (edges) {
			return edges.reduce((acc: { [x: string]: string }, d: EdgeData) => {
				const id = d.source
				acc[id] = d.target
				acc[d.target] = id
				return acc
			}, {})
		}
	}, [edges])

	useEffect(() => {
		if (!nodes) {
			loadRemoteData('./data/static/nodes.csv', setNodes)
		}
		if (!edges) {
			loadRemoteData('./data/static/edges.csv', setEdges)
		}
		if (!join) {
			loadRemoteData('./data/static/join.csv', setJoin)
		}
	}, [setNodes, setEdges, setJoin, loadRemoteData])

	return useMemo((): [any[], any[], any[], any] => {
		if (nodeMap && selectedJoin && edgeMap && communityMap) {
			const data = selectedJoin.map((arr: JoinData[]) => {
				const clusterId = arr[0].clusterId
				const selectedNodes = arr.map((d: JoinData) => {
					const node = nodeMap[d.nodeId]
					return Object.assign(
						{},
						{ id: node.id, attrs: { ...node }, cid: `${d.clusterId}` },
					)
				})

				const selectedEdges = arr
					.map((d: JoinData) => {
						const targetId = edgeMap[d.nodeId]
						const targetNode: NodeData = nodeMap[targetId]
						if (targetNode) {
							const clusterId = communityMap[targetId].clusterId
							return Object.assign(
								{},
								{
									id: targetNode.id,
									attrs: { ...targetNode },
									cid: clusterId,
									neighbor: d.clusterId,
								},
							)
						}
					})
					.filter(d => d)
				return {
					communityId: `${clusterId}`,
					size: arr.length,
					nodes: selectedNodes,
					edges: selectedEdges,
					neighborSize: selectedEdges.length,
				}
			})

			const [communities, nodes, edges] = data.reduce(
				(acc: any[][][], o: CommunityData) => {
					const comm = Object.assign(
						{},
						{
							communityId: o.communityId,
							size: o.size,
							neighborSize: o.neighborSize,
						},
					)
					const nodes = o.nodes
					const edges = o.edges
					acc[0].push(comm as any)
					acc[1] = [...acc[1], ...nodes]
					acc[2] = [...acc[2], ...edges]
					return acc
				},
				[[], [], []] as [any[], any[], any[]],
			)

			return [communities, nodes, edges, clusterIdMap]
		}
		return [[], [], [], clusterIdMap]
	}, [selectedJoin, nodeMap, edgeMap, communityMap, clusterIdMap])
}
