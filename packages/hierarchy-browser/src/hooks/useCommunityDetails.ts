/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { max } from 'd3-array'
import { useMemo } from 'react'
import { CommunityId, ICommunityDetail } from '..'

export function useCommunityLevelText(
	level: number,
	incrementLevel?: boolean,
): string {
	return useMemo(() => `Level: ${incrementLevel ? level + 1 : level}`, [
		incrementLevel,
		level,
	])
}

export function useCommunityLevelCalculator(
	data: ICommunityDetail[],
): [number, number] {
	return useMemo(() => {
		return [0, data.length - 1]
	}, [data])
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
