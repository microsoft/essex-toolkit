/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IChoiceGroupOption, Toggle } from '@fluentui/react'
import React, { useCallback, useMemo, useState } from 'react'
import { CSF } from './types'
import { Selections } from './utils/components'
import { LocalEntity, NeighborLocalEntity } from './utils/types'
import { useData } from './utils/useData'
import { options, selectedClusterID } from './utils/utils'
import {
	HierarchyBrowser,
	ILoadParams,
	INeighborCommunityDetail,
	CommunityId,
} from '@essex-js-toolkit/hierarchy-browser'

const story = {
	title: 'HierarchyBrowserStory',
}

export default story

export const HierarchyBrowserStory: CSF = () => {
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

	const [communities, nodes, edges] = useData(selectedOption)

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
		[edges, allEntities, loadState],
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
				label="Neighbors Loaded"
				checked={loadState}
				onChange={handleNeighborsLoaded}
			/>
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
