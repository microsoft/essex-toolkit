/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'
import { INeighborCommunityDetail } from '..'

export function useNeighborsLoadedHandler(
	initialLoadingState: boolean,
): [
	INeighborCommunityDetail[],
	boolean,
	boolean,
	(
		communities: INeighborCommunityDetail[],
		error?: Error | undefined | string,
	) => void,
	(loading: boolean) => void,
] {
	const [isLoading, setLoading] = useState(initialLoadingState)
	const [communities, setCommunities] = useState<INeighborCommunityDetail[]>([])
	const [communitiesLoaded, setcommunitiesLoaded] = useState(false)

	const clearCommunities = useCallback(
		(loading: boolean) => {
			setcommunitiesLoaded(false)
			setCommunities([])
			setLoading(loading)
		},
		[setcommunitiesLoaded, setLoading],
	)

	// control loading state and display entities
	const handleCommunitiesLoaded = useCallback(
		(
			communities: INeighborCommunityDetail[],
			error?: Error | undefined | string,
		) => {
			if (error) {
				console.error(error)
			}
			setCommunities(communities)
			setLoading(false)
			setcommunitiesLoaded(true)
		},
		[setCommunities, setLoading, setcommunitiesLoaded],
	)

	return [
		communities,
		isLoading,
		communitiesLoaded,
		handleCommunitiesLoaded,
		clearCommunities,
	]
}
