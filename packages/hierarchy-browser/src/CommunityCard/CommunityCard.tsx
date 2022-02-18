/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { EmptyEntityList } from '../EntityItem/EmptyEntityList.js'
import { ScrollArea } from '../ScollArea/index.js'
import { CommunityDataProvider } from '../common/dataProviders/index.js'
import { useContainerStyle } from '../hooks/theme.js'
import { useCommunityData } from '../hooks/useCommunityData.js'
import { useCommunitySizePercent } from '../hooks/useCommunitySizePercent.js'
import { useUpdatedCommunityProvider } from '../hooks/useUpdatedCommunityProvider.js'
import {
	EntityId,
	ILoadNeighborCommunities,
	IOnSelectionChange,
	ISettings,
} from '../index.js'
import { AdjacentCommunities } from './AdjacentCommunities/index.js'
import { CommunityOverview } from './CommunityOverview.js'
import { CommunityTable } from './CommunityTable.js'

export interface ICommunityCardProps {
	maxSize: number
	maxLevel: number
	level: number
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	neighborCallback?: ILoadNeighborCommunities
	settings: ISettings
	dataProvider: CommunityDataProvider
	toggleUpdate: boolean
	selections?: EntityId[]
	onSelectionChange?: IOnSelectionChange
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
		toggleUpdate,
		selections,
		onSelectionChange,
	}: ICommunityCardProps) {
		const {
			isOpen: isOpenProp,
			minimizeColumns,
			visibleColumns,
			styles,
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
		const contentStyle = useContainerStyle(isOpen)

		const loadingElement = useMemo(
			() => (isLoading ? <Spinner label={ENTITY_LOADER_MSG} /> : null),
			[isLoading],
		)

		const handleEntityClick = useCallback(
			(entiyId: EntityId) => {
				if (onSelectionChange) {
					const currentSelection = selections || []
					const deduped = new Set(currentSelection)
					if (deduped.has(entiyId)) {
						deduped.delete(entiyId)
						onSelectionChange(Array.from(deduped))
					} else {
						deduped.add(entiyId)
						onSelectionChange(Array.from(deduped))
					}
				}
			},
			[onSelectionChange, selections],
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
					styles={styles?.cardOverview}
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
									styles={styles?.table}
									minimize={minimizeColumns}
									selections={selections}
									onSelectionChange={handleEntityClick}
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
						styles={styles?.table}
						visibleColumns={visibleColumns}
						minimizeColumns={minimizeColumns}
						refresh={toggleUpdate}
						selections={selections}
						onSelectionChange={handleEntityClick}
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
