/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { IEntityDetail } from '../index.js'
import { IEntityLoadParams } from '../hooks/useLoadMoreEntitiesHandler.js'

export interface IScrollAreaProps {
	loadMore: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined
	hasMore: boolean
	children?: ReactNode
}

export const ScrollArea: React.FC<IScrollAreaProps> = memo(function ScrollArea({
	loadMore,
	hasMore,
	children,
}: IScrollAreaProps) {
	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={loadMore}
			hasMore={hasMore}
			useWindow={false}
			loader={<Spinner key="ei_spinner" label="Loading more records..." />}
		>
			{children}
		</InfiniteScroll>
	)
})
