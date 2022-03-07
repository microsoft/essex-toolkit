/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { max } from 'd3-array'
import { useMemo } from 'react'
import type { ICommunity } from '../common/types/index.js'
import type { CommunityId, ICommunityDetail } from '../index.js'

export function useCommunityLevelText(
	level: number,
	incrementLevel?: boolean,
): string {
	return useMemo(
		() => `Level: ${incrementLevel ? level + 1 : level}`,
		[incrementLevel, level],
	)
}

export function useCommunityLevelCalculator(
	data: ICommunityDetail[],
): [number, number, ICommunity[]] {
	const [min, max] = useMemo(() => {
		return [0, data.length - 1]
	}, [data])

	const communityWithLevels = useMemo(() => {
		const reverseList = [...data].reverse()
		return reverseList.map(
			(comm, index) => ({ ...comm, level: index } as ICommunity),
		)
	}, [data])
	return [min, max, communityWithLevels]
}

export function useCommunitySizeCalculator(data: ICommunityDetail[]): number {
	return useMemo(() => {
		const maxSize = max(data, (d: ICommunityDetail) => d.size)
		if (!maxSize) {
			return 0
		}
		return maxSize
	}, [data])
}

export function useCommunityText(communityId: CommunityId): string {
	return useMemo(() => `Community: ${communityId}`, [communityId])
}
