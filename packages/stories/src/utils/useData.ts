/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ICommunityDetail } from '@essex-js-toolkit/hierarchy-browser'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
	CommunityData,
	EdgeData,
	JoinData,
	LocalEntity,
	NeighborLocalEntity,
	NodeData,
} from './types'
import { loadRemoteData, search } from './utils'

export function useData(
	selectedOption: string,
): [
	ICommunityDetail[],
	LocalEntity[],
	NeighborLocalEntity[],
	(selection: string) => JoinData[][] | undefined,
] {
	const [nodes, setNodes] = useState<NodeData[] | undefined>()
	const [edges, setEdges] = useState<EdgeData[] | undefined>()
	const [join, setJoin] = useState<JoinData[] | undefined>()

	const clusterIdMap = useMemo((): { [x: string]: JoinData[] } | undefined => {
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

	const searchForChildren = useCallback(
		(selection: string): JoinData[][] | undefined => {
			if (clusterIdMap) {
				return search([selection], clusterIdMap)
			}
		},
		[clusterIdMap],
	)

	const selectedJoin = useMemo(
		(): JoinData[][] | undefined => searchForChildren(selectedOption),
		[searchForChildren, selectedOption],
	)

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

	const nodeMap = useMemo((): { [x: string]: NodeData } | undefined => {
		if (nodes) {
			return nodes.reduce((acc: { [x: string]: NodeData }, d: NodeData) => {
				const id = d.id
				acc[id] = d
				return acc
			}, {})
		}
	}, [nodes])

	const edgeMap = useMemo((): { [x: string]: string } | undefined => {
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
	}, [setNodes, setEdges, setJoin, nodes, edges, join])

	const [comm, entities, neighborComm] = useMemo((): [
		ICommunityDetail[],
		LocalEntity[],
		NeighborLocalEntity[],
	] => {
		if (nodeMap && selectedJoin && edgeMap && communityMap) {
			const data: CommunityData[] = selectedJoin.map((arr: JoinData[]) => {
				const clusterId = arr[0].clusterId
				const selectedNodes = arr.map((d: JoinData) => {
					const node = nodeMap[d.nodeId]
					return { id: node.id, attrs: { ...node }, cid: `${d.clusterId}` }
				})

				const selectedEdges = arr.reduce((acc, d: JoinData) => {
					const targetId = edgeMap[d.nodeId]
					const targetNode: NodeData = nodeMap[targetId]
					if (targetNode) {
						const clusterId = `${communityMap[targetId].clusterId}`
						const o = {
							id: targetNode.id,
							attrs: { ...targetNode },
							cid: clusterId,
							neighbor: `${d.clusterId}`,
						}
						acc.push(o)
					}
					return acc
				}, [] as NeighborLocalEntity[])
				return {
					communityId: `${clusterId}`,
					size: arr.length,
					nodes: selectedNodes,
					edges: selectedEdges,
					neighborSize: selectedEdges.length,
				}
			})
			const container = [[], [], []]
			const arrays = data.reduce((acc: any[][], o: CommunityData) => {
				const entityIds = o.nodes.map((d: any) => d.id)
				const comm = {
					communityId: o.communityId,
					entityIds,
					size: o.size,
					neighborSize: o.neighborSize,
				}
				const nodes = o.nodes
				const edges = o.edges
				acc[0].push(comm as ICommunityDetail)
				acc[1] = [...acc[1], ...nodes] as LocalEntity[]
				acc[2] = [...acc[2], ...edges] as NeighborLocalEntity[]
				return acc
			}, container)

			return arrays as [
				ICommunityDetail[],
				LocalEntity[],
				NeighborLocalEntity[],
			]
		}
		return [[], [], []]
	}, [selectedJoin, nodeMap, edgeMap, communityMap])

	return [comm, entities, neighborComm, searchForChildren]
}
