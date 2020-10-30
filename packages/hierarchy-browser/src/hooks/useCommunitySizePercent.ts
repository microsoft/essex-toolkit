/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { ICommunityDetail } from '..'

export function useCommunitySizePercent(
	community: ICommunityDetail,
	maxSize: number,
): number {
	return useMemo(() => community.size / maxSize, [community, maxSize])
}
