/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { INeighborCommunityDetail } from '../../index.js'

export function useSortedNeighbors(
	edges?: INeighborCommunityDetail[],
): INeighborCommunityDetail[] | undefined {
	return useMemo(() => {
		if (edges && edges.length > 0) {
			return edges.sort((a, b) => b.connections - a.connections)
		}
	}, [edges])
}
