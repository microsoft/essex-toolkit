/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseButton, Button } from '@fluentui/react'
import { useCallback, useState } from 'react'

import type { IEntityDetail } from '../index.js'
import type { CommunityId } from '../types/index.js'
import { exportCSVFile } from '../utils/utils.js'
import type { IEntityLoadParams } from './useLoadMoreEntitiesHandler.js'

export const downloadCommunityMemebers = async (
	communityId: CommunityId,
	size: number,
	getEntityCallback: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined,
	level: number,
): Promise<void> => {
	const response = await getEntityCallback(undefined, {
		loadCount: size,
		communityId: communityId,
	})
	const filename = `c${communityId}_level${level}`
	if (response) {
		exportCSVFile(response, filename)
	} else {
		throw Error('DataProvider undefined, unable to download CSV')
	}
}

export function useCommunityDownload(
	communityId: CommunityId,
	size: number,
	getEntityCallback: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined,
	level: number,
): [
	(
		event: React.MouseEvent<
			| HTMLAnchorElement
			| HTMLButtonElement
			| HTMLDivElement
			| BaseButton
			| Button
			| HTMLSpanElement,
			MouseEvent
		>,
	) => void,
	boolean,
] {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleDownloadClick = useCallback(
		(
			event: React.MouseEvent<
				| HTMLAnchorElement
				| HTMLButtonElement
				| HTMLDivElement
				| BaseButton
				| Button
				| HTMLSpanElement,
				MouseEvent
			>,
		) => {
			event.stopPropagation()
			setIsLoading(true)
			console.log(`initiated download of level: ${level} community: ${level}`)
			downloadCommunityMemebers(communityId, size, getEntityCallback, level)
				.catch((reason: string) => {
					console.error(reason)
				})
				.finally(() => setIsLoading(false))
		},
		[communityId, setIsLoading, getEntityCallback, level, size],
	)

	return [handleDownloadClick, isLoading]
}
