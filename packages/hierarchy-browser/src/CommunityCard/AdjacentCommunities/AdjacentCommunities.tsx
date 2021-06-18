/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React from 'react'
import styled from 'styled-components'
import CommunityEdgeList from '../../NeighborList/CommunityEdgeList'
import { ScrollArea } from '../../ScollArea'
import { CommunityDataProvider } from '../../common/dataProviders'
import { useThemesAccentStyle } from '../../hooks/theme'
import { EntityId, ITableSettings } from '../../types'
import { CommunityTable } from '../CommunityTable'
import { TableExpander } from '../TableExpander'
import { useAdjacentCommunityData } from './hooks/useAdjacentCommunityData'
import { useEdgeSelection } from './hooks/useEdgeSelection'
import { useExpandedPanel } from './hooks/useExpandedPanel'
const ENTITY_LOADER_MSG = 'Fetching entity data...'

interface IAdajacentCommunities {
	dataProvider: CommunityDataProvider
	isOpen: boolean
	styles?: ITableSettings
	visibleColumns: string[] | undefined
	minimizeColumns: boolean | undefined
	refresh: boolean
	selections?: EntityId[]
	onSelectionChange: (id: EntityId) => void
}

export const AdjacentCommunities: React.FC<IAdajacentCommunities> =
	function AdjacentCommunities({
		dataProvider,
		isOpen,
		styles,
		visibleColumns,
		minimizeColumns,
		refresh,
		selections,
		onSelectionChange,
	}: IAdajacentCommunities) {
		const colorStyle = useThemesAccentStyle(isOpen)

		const {
			edgeContentStyle,
			edgeEntitiesContentStyle,
			edgeEntitiesExpanderClick,
			edgeExpanderClick,
			edgeListOpen,
			edgeEntitiesOpen,
		} = useExpandedPanel({ isOpen })

		const [
			setEdgeSelection,
			loadMoreEntities,
			moreEntitiesToLoad,
			edgeEntities,
			selectedCommunityEdge,
			clearCurrentSelection,
		] = useEdgeSelection(dataProvider)
		const [adjacentCommunities, isAdjacentEntitiesLoading] =
			useAdjacentCommunityData(dataProvider, isOpen, refresh)

		return (
			<>
				{adjacentCommunities && adjacentCommunities.length > 0 ? (
					<>
						<Spacer style={colorStyle} className={'neighbor-expander-button'}>
							{isOpen ? (
								<TableExpander
									isOpen={edgeListOpen}
									handleButtonClick={edgeExpanderClick}
									styles={styles?.neighborExpandButton}
								/>
							) : null}
						</Spacer>
						<Content style={edgeContentStyle}>
							<CommunityEdgeList
								edges={adjacentCommunities}
								selectedEdge={selectedCommunityEdge}
								onEdgeClick={setEdgeSelection}
								clearCurrentSelection={clearCurrentSelection}
								isOpen={edgeListOpen}
								styles={styles}
							/>
						</Content>
					</>
				) : null}
				{isAdjacentEntitiesLoading || edgeEntities?.length > 0 ? (
					<>
						<Spacer style={colorStyle} className={'neighbor-expander-button'}>
							{isOpen ? (
								<TableExpander
									isOpen={edgeEntitiesOpen}
									handleButtonClick={edgeEntitiesExpanderClick}
									styles={styles?.neighborExpandButton}
								/>
							) : null}
						</Spacer>
						<Content style={edgeEntitiesContentStyle}>
							{edgeEntities?.length > 0 && edgeEntitiesOpen ? (
								<ScrollArea
									loadMore={loadMoreEntities}
									hasMore={moreEntitiesToLoad}
								>
									<CommunityTable
										entities={edgeEntities}
										communityId={selectedCommunityEdge?.communityId}
										visibleColumns={visibleColumns}
										styles={styles}
										minimize={minimizeColumns}
										selections={selections}
										onSelectionChange={onSelectionChange}
									/>
								</ScrollArea>
							) : null}
							{isAdjacentEntitiesLoading ? (
								<Spinner label={ENTITY_LOADER_MSG} />
							) : null}
						</Content>
					</>
				) : null}
			</>
		)
	}
const Content = styled.div`
	overflow-y: auto;
	transition: height 0.2s;
`
const Spacer = styled.div`
	border-style: solid;
	border-width: 0px 0.5px 0px 0.5px;
	align-self: center;
	overflow: hidden;
`
