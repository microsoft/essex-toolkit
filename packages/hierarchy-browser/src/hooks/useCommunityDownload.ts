/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BaseButton, Button } from '@fluentui/react'
import { useState, useCallback } from 'react'
import { ICommunityDetail, IEntityDetail } from '..'
import { exportCSVFile } from '../utils/utils'
import { IEntityLoadParams } from './useLoadMoreEntitiesHandler'

export const downloadCommunityMemebers = async (
	community: ICommunityDetail,
	getEntityCallback: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined,
	level: number,
): Promise<void> => {
	const response = await getEntityCallback(undefined, {
		loadCount: community.size,
		communityId: community.communityId,
	})
	const filename = `c${community.communityId}_level${level}`
	if (response) {
		exportCSVFile(response, filename)
	} else {
		throw Error('DataProvider undefined, unable to download CSV')
	}
}

export function useCommunityDownload(
	community: ICommunityDetail,
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
			const promise = downloadCommunityMemebers(
				community,
				getEntityCallback,
				level,
			)
			promise.catch((reason: string) => {
				console.error(reason)
			})
			promise.finally(() => setIsLoading(false))
		},
		[community, setIsLoading, getEntityCallback, level],
	)

	return [handleDownloadClick, isLoading]
}
