/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ILoadEntitiesAsync,
	ILoadNeighborCommunitiesAsync,
	ILoadParams,
	INeighborCommunityDetail,
} from '@essex/hierarchy-browser'
import { useCallback, useMemo } from 'react'

import type { JoinData, LocalEntity, NeighborLocalEntity } from './types.js'

interface AsyncProps {
	nodes: LocalEntity[]
	edges: NeighborLocalEntity[]
	loadState?: boolean
	searchForChildren: (selection: string) => JoinData[][] | undefined
}
export function useAsyncCallbacks({
	nodes,
	edges,
	loadState,
	searchForChildren,
}: AsyncProps): [ILoadEntitiesAsync, ILoadNeighborCommunitiesAsync] {
	const allEntities = useMemo(() => [...nodes, ...edges], [nodes, edges])

	// Callback for HB to fetch entities in community based communityId
	const getEntities = useCallback(
		async (params: ILoadParams) => {
			// this seems useless, should be sync
			await Promise.resolve()

			if (allEntities) {
				const communityId = params.communityId
				const selection = allEntities.reduce(
					(acc, d) => {
						if (`${d.cid}` === communityId && !acc[0].has(d.id)) {
							acc[0].add(d.id)
							acc[1].push(d)
						}
						return acc
					},
					[new Set<string>([]), []] as [Set<string>, LocalEntity[]],
				)

				return { data: selection[1], error: undefined }
			}
			return { error: new Error('nodes not loaded in story'), data: undefined }
		},
		[allEntities],
	)

	// Callback for HB to fetch neighbor communities based communityId
	const getNeighbors = useCallback(
		async (params: ILoadParams) => {
			// this seems useless, should be sync
			await Promise.resolve()

			if (edges && loadState) {
				const selected = edges.filter(
					d => `${d.neighbor}` === params.communityId,
				)
				const parents = selected.reduce((acc, e: NeighborLocalEntity) => {
					acc[e.cid] = acc[e.cid] ? acc[e.cid] + 1 : 1
					return acc
				}, {} as { [key: string]: number })
				const data = Object.keys(parents).map((key: string) => {
					const connections = parents[key]
					const edgeCommunityId = params.communityId
					const communityId = key
					const values = searchForChildren(communityId)
					let count = 0
					if (values) {
						count = values.reduce((counter, arr) => {
							counter = arr.length + counter
							return counter
						}, 0 as number)
					}
					return {
						communityId,
						edgeCommunityId,
						connections,
						size: count,
					} as INeighborCommunityDetail
				})
				return { data }
			}
			return { error: new Error('edges not loaded in story') }
		},
		[edges, loadState, searchForChildren],
	)
	return [getEntities, getNeighbors]
}
