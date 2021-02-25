/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useCallback, useMemo } from 'react'
import { CSF } from './types'
import { LocalEntity, NeighborLocalEntity } from './utils/types'
import { useData } from './utils/useData'
import {
	HierarchyBrowser,
	ILoadParams,
	INeighborCommunityDetail,
	IEntityDetail,
	CommunityId,
} from '@essex-js-toolkit/hierarchy-browser'

const story = {
	title: 'HierarchyBrowserStory',
}

export default story
export const HierarchyBrowserStory: CSF = () => {
	const [communities, nodes, edges] = useData()

	const allEntities = useMemo(() => [...nodes, ...edges], [nodes, edges])

	// Callback for HB to fetch entities in community based communityId
	const getEntities = useCallback(
		async (params: ILoadParams) => {
			if (allEntities) {
				const communityId = params.communityId
				const selection = allEntities.filter(
					(d: LocalEntity) => `${d.cid}` === communityId,
				)

				return { data: selection, error: undefined }
			}
			return { error: new Error('nodes not loaded in story'), data: undefined }
		},
		[allEntities],
	)

	// Callback for HB to fetch neighbor communities based communityId
	const getNeighbors = useCallback(
		async (params: ILoadParams) => {
			if (edges && allEntities) {
				const selected = edges.filter(
					d => `${d.neighbor}` === params.communityId,
				)
				const parents = selected.reduce((acc, e: NeighborLocalEntity) => {
					acc[e.cid] = acc[e.cid] ? +1 : 1
					return acc
				}, {} as { [key: string]: number })
				const data = Object.keys(parents).map((key: string) => {
					const connections = parents[key]
					const edgeCommunityId = params.communityId
					const communityId = key as CommunityId
					const selection = allEntities.filter(
						(d: LocalEntity) => `${d.cid}` === communityId,
					)
					const size = selection.length
					return {
						communityId,
						edgeCommunityId,
						connections,
						size,
					} as INeighborCommunityDetail
				})
				return { data, error: undefined }
			}
			return { error: new Error('edges not loaded in story'), data: undefined }
		},
		[edges, allEntities],
	)

	return (
		<>
			{communities && (
				<HierarchyBrowser
					communities={communities}
					entities={getEntities as any}
					neighbors={getNeighbors as any}
				/>
			)}
		</>
	)
}

HierarchyBrowserStory.story = {
	name: 'main',
}
