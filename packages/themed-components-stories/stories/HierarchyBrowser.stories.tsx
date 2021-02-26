/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IChoiceGroupOption, Toggle } from '@fluentui/react'
import React, { useCallback, useMemo, useState } from 'react'
import { CSF } from './types'
import { Selections } from './utils/components'
import { JoinData, LocalEntity, NeighborLocalEntity } from './utils/types'
import { useData } from './utils/useData'
import { options, selectedClusterID, visibleColumns } from './utils/utils'
import {
	HierarchyBrowser,
	ILoadParams,
	INeighborCommunityDetail,
	CommunityId,
	ICommunityDetail,
	ISettings,
} from '@essex-js-toolkit/hierarchy-browser'

const story = {
	title: 'HierarchyBrowser',
}

export default story

export const HierarchyBrowserAsync: CSF = () => {
	const [selectedOption, setSelectedOption] = useState<string>(
		`${selectedClusterID}`,
	)

	const [loadState, setLoadState] = useState<boolean | undefined>(false)

	const onChange = useCallback(
		(option: IChoiceGroupOption) => setSelectedOption(option.key),
		[setSelectedOption],
	)

	const handleNeighborsLoaded = useCallback(
		(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) =>
			setLoadState(checked),
		[setLoadState],
	)

	const [communities, nodes, edges, searchForChildren] = useData(selectedOption)

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
			if (edges && allEntities && loadState) {
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
					const communityId = key as CommunityId
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
				return { data, error: undefined }
			}
			return { error: new Error('edges not loaded in story'), data: undefined }
		},
		[edges, allEntities, loadState, searchForChildren],
	)

	return (
		<>
			<Selections
				options={options}
				defaultSelectedKey={`${selectedClusterID}`}
				label={'selected community'}
				onChange={onChange}
			/>
			<Toggle
				label="neighbors loaded"
				checked={loadState}
				onChange={handleNeighborsLoaded}
			/>
			{communities && (
				<HierarchyBrowser
					communities={communities}
					entities={getEntities as any}
					neighbors={getNeighbors as any}
					settings={
						{ visibleColumns, controls: { showFilter: false } } as ISettings
					}
				/>
			)}
		</>
	)
}

HierarchyBrowserAsync.story = {
	name: 'Async',
}

export const HierarchyBrowserSynchronous: CSF = () => {
	const [selectedOption, setSelectedOption] = useState<string>(
		`${selectedClusterID}`,
	)

	const onChange = useCallback(
		(option: IChoiceGroupOption) => setSelectedOption(option.key),
		[setSelectedOption],
	)

	const [communities, nodes, edges, searchForChildren] = useData(selectedOption)

	const allEntities = useMemo(() => [...nodes, ...edges], [nodes, edges])

	// Callback for HB to fetch neighbor communities based communityId
	const getNeighbors = useCallback(
		(communityId: string) => {
			if (edges && allEntities) {
				const selected = edges.filter(d => `${d.neighbor}` === communityId)
				const parents = selected.reduce((acc, e: NeighborLocalEntity) => {
					acc[e.cid] = acc[e.cid] ? acc[e.cid] + 1 : 1
					return acc
				}, {} as { [key: string]: number })
				const data = Object.keys(parents).map((key: string) => {
					const connections = parents[key]
					const edgeCommunityId = communityId
					const commID = key as CommunityId
					const values = searchForChildren(commID)
					let ids: string[] = []
					if (values) {
						const entities = values.reduce((totalEntities, arr) => {
							totalEntities = totalEntities.concat(arr)
							return totalEntities
						}, [] as JoinData[])
						ids = entities.map((d: JoinData) => d.nodeId)
					}
					return {
						communityId: commID,
						edgeCommunityId,
						connections,
						entityIds: ids,
						size: ids.length,
					} as INeighborCommunityDetail
				})
				return data
			}
			return []
		},
		[edges, allEntities, searchForChildren],
	)

	const neighborData = useMemo(() => {
		return communities.reduce((acc, d: ICommunityDetail) => {
			const adjNeighbors = getNeighbors(d.communityId)
			acc = [...acc, ...adjNeighbors]
			return acc
		}, [] as INeighborCommunityDetail[])
	}, [getNeighbors, communities])

	return (
		<>
			<Selections
				options={options}
				defaultSelectedKey={`${selectedClusterID}`}
				label={'selected community'}
				onChange={onChange}
			/>
			{communities && (
				<HierarchyBrowser
					communities={communities}
					entities={allEntities}
					neighbors={neighborData}
					settings={{ minimizeColumns: true }}
				/>
			)}
		</>
	)
}

HierarchyBrowserSynchronous.story = {
	name: 'Synchronous',
}
