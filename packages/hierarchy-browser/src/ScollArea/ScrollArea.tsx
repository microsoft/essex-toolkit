/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { memo } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { IEntityDetail } from '..'
import { IEntityLoadParams } from '../hooks/useLoadMoreEntitiesHandler'

export interface IScrollAreaProps {
	loadMore: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined
	hasMore: boolean
}

export const ScrollArea: React.FC<IScrollAreaProps> = memo(
	({ loadMore, hasMore, children }) => {
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
	},
)
ScrollArea.displayName = 'ScrollArea'
