/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { ILoadNeighborCommunities } from '..'
import { EmptyEntityList } from '../EntityItem/EmptyEntityList'
import { ScrollArea } from '../ScollArea'
import { CommunityDataProvider } from '../common/dataProviders'
import { useContainerStyle } from '../hooks/theme'
import { useCommunityData } from '../hooks/useCommunityData'
import { useCommunitySizePercent } from '../hooks/useCommunitySizePercent'
import { ISettingState } from '../hooks/useSettings'
import { useUpdatedCommunityProvider } from '../hooks/useUpdatedCommunityProvider'
import { CommunityOverview } from './CommunityOverview'
import { CommunityTable } from './CommunityTable'
import { AdjacentCommunities } from './AdjacentCommunities'

export interface ICommunityCardProps {
	maxSize: number
	maxLevel: number
	level: number
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	neighborCallback?: ILoadNeighborCommunities
	settings: ISettingState
	dataProvider: CommunityDataProvider
}

const ENTITY_LOADER_MSG = 'Fetching entity data...'

export const CommunityCard: React.FC<ICommunityCardProps> = memo(
	function CommunityCard({
		maxSize,
		maxLevel,
		level,
		incrementLevel,
		neighborCallback,
		settings,
		dataProvider,
	}: ICommunityCardProps) {
		const {
			isOpen: isOpenProp,
			minimizeColumns,
			visibleColumns,
			fontStyles,
			controls,
		} = settings

		useUpdatedCommunityProvider(dataProvider, level, neighborCallback)

		const [
			entities,
			isLoading,
			loadMore,
			hasMore,
			isOpen,
			toggleOpen,
			filterProps,
		] = useCommunityData(dataProvider, isOpenProp, maxLevel)

		const sizePercent = useCommunitySizePercent(dataProvider.size, maxSize)
		const contentStyle = useContainerStyle(isOpen, entities.length > 0)

		const loadingElement = useMemo(
			() => (isLoading ? <Spinner label={ENTITY_LOADER_MSG} /> : null),
			[isLoading],
		)

		return (
			<Container>
				<CommunityOverview
					communityId={dataProvider.communityId}
					onToggleOpen={toggleOpen}
					incrementLevel={incrementLevel}
					sizePercent={sizePercent}
					filterProps={filterProps}
					getEntityCallback={loadMore}
					level={level}
					fontStyles={fontStyles}
					controls={controls}
					neighborSize={dataProvider.neighborSize}
					size={dataProvider.size}
				/>
				<Flex>
					<Content style={contentStyle}>
						{entities?.length > 0 ? (
							<ScrollArea loadMore={loadMore} hasMore={hasMore}>
								<CommunityTable
									entities={entities}
									communityId={dataProvider.communityId}
									visibleColumns={visibleColumns}
									fontStyles={fontStyles}
									minimize={minimizeColumns}
								/>
							</ScrollArea>
						) : null}
						{loadingElement}
						<EmptyEntityList
							filterProps={filterProps}
							entities={entities}
							isLoading={isLoading}
						/>
					</Content>
					<AdjacentCommunities
						dataProvider={dataProvider}
						isOpen={isOpen}
						entities={entities}
						fontStyles={fontStyles}
						visibleColumns={visibleColumns}
						minimizeColumns={minimizeColumns}
					/>
				</Flex>
			</Container>
		)
	},
)

const Container = styled.div``

const Flex = styled.div`
	display: flex;
`

const Content = styled.div`
	overflow-y: auto;
	transition: height 0.2s;
`
