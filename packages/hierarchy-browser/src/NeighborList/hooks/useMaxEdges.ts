/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import type { INeighborCommunityDetail } from '../../index.js'

export function useMaxEdges(
	edges?: INeighborCommunityDetail[],
): [number | undefined, number | undefined] {
	return useMemo(() => {
		return edges && edges.length > 0
			? edges.reduce(
					(prev, current) => {
						if (current.connections > prev[0]) {
							prev[0] = current.connections
						}
						if (current.size > prev[1]) {
							prev[1] = current.size
						}
						return prev
					},
					[0, 0],
			  )
			: [NaN, NaN]
	}, [edges])
}
