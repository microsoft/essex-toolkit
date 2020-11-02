/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CommunityCard } from './CommunityCard/CommunityCard'
import { HierarchyDataProvider } from './common/dataProviders/HierachyDataProvider'
import {
	useCommunityLevelCalculator,
	useCommunitySizeCalculator,
} from './hooks/useCommunityDetails'
import {
	ICommunityDetail,
	IEntityDetail,
	ILoadEntitiesAsync,
	ILoadNeighborCommunitiesAsync,
	INeighborCommunityDetail,
} from './types'

export interface IHierarchyBrowserProps {
	communities: ICommunityDetail[]
	entities?: IEntityDetail[] | ILoadEntitiesAsync
	neighbors?: INeighborCommunityDetail[] | ILoadNeighborCommunitiesAsync
}

export const HierarchyBrowser = memo(function HierarchyBrowser({
	communities,
	entities,
	neighbors,
}: IHierarchyBrowserProps) {
	const [hierachyDataProvider] = useState<HierarchyDataProvider | undefined>(
		() => new HierarchyDataProvider(communities, entities, neighbors),
	)
	const [minLevel, maxLevel] = useCommunityLevelCalculator(communities)
	const maxSize = useCommunitySizeCalculator(communities)

	const children = useMemo(
		() =>
			hierachyDataProvider &&
			communities.map((c, index) => (
				<CommunityCard
					community={c}
					key={`_card_${index}_${c.communityId}`}
					incrementLevel={minLevel === 0}
					isOpen={index === 0}
					maxSize={maxSize}
					maxLevel={maxLevel}
					hierachyDataProvider={hierachyDataProvider}
					level={maxLevel - index}
				/>
			)),
		[communities, maxLevel, maxSize, minLevel, hierachyDataProvider],
	)

	return (
		<div>
			<CardContainer>{children}</CardContainer>
		</div>
	)
})

const CardContainer = styled.div`
	margin: 10px 10px 10px 10px;
	overflow-y: auto;
`
