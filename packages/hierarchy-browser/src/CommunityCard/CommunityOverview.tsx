/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Spinner, TooltipHost, Text } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { ICommunityDetail, IEntityDetail } from '..'
import { MagBar } from '../MagBar'
import { headerLabel, subHeaderLabel, paddingLeft } from '../common/styles'
import { IFilterProps } from '../hooks/interfaces'
import { useFilterButtonStyle, useThemesStyle } from '../hooks/theme'
import {
	useCommunityLevelText,
	useCommunityText,
} from '../hooks/useCommunityDetails'
import { useCommunityDownload } from '../hooks/useCommunityDownload'
import { IEntityLoadParams } from '../hooks/useLoadMoreEntitiesHandler'

export interface ICommunityOverviewProps {
	community: ICommunityDetail
	sizePercent: number
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	onToggleOpen: () => void
	filterProps: IFilterProps
	getEntityCallback: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined
	level: number
}
const DEFAULT_MAGBAR_WIDTH = 120
const SPINNER_STYLE = { marginLeft: 17 }
export const CommunityOverview: React.FC<ICommunityOverviewProps> = memo(
	({
		community,
		sizePercent,
		incrementLevel,
		onToggleOpen,
		filterProps,
		getEntityCallback,
		level,
	}) => {
		const levelLabel = useCommunityLevelText(level, incrementLevel)
		const communityText = useCommunityText(community)
		const style = useThemesStyle()
		const buttonStyle = useFilterButtonStyle()

		const handleFilterChange = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				event.stopPropagation()
				filterProps.toggleFilter()
			},
			[filterProps],
		)

		const [handleDownload, downloadInProgress] = useCommunityDownload(
			community,
			getEntityCallback,
			level,
		)

		return (
			<FlexyContainer onClick={onToggleOpen} style={style}>
				<Grid>
					<div style={{ marginLeft: paddingLeft, gridRow: 1, gridColumn: 1 }}>
						<div>
							<Text variant={headerLabel}>
								<b>{communityText}</b>
							</Text>
						</div>
						<div>
							<Text variant={subHeaderLabel}>{levelLabel}</Text>
						</div>
					</div>
					{community.neighborSize && community.neighborSize > 0 ? (
						<div style={{ gridRow: 1, gridColumn: 2, justifySelf: 'center' }}>
							<TooltipHost content="Number of neighboring (connected) communities.  Members of neighboring communities may be related, but are less tightly connected that those within the community.">
								<div>
									<Text
										variant={subHeaderLabel}
									>{`Neighbors: ${community.neighborSize}`}</Text>
								</div>
								<div style={{ visibility: 'hidden', height: 10 }}></div>
							</TooltipHost>
						</div>
					) : null}
					<div style={{ gridRow: 1, gridColumn: 3, justifySelf: 'end' }}>
						<FlexySubContainer>
							{community.size ? (
								<div>
									<div>
										<Text variant={subHeaderLabel}>
											Members: {community.size.toLocaleString()}
										</Text>
									</div>
									<MagBar percent={sizePercent} width={DEFAULT_MAGBAR_WIDTH} />
								</div>
							) : null}
							<TooltipHost
								content={`Show only unique entities between level ${level} and ${
									level + 1
								}.`}
							>
								<IconButton
									style={buttonStyle}
									iconProps={{
										iconName: filterProps.state ? 'Filter' : 'ClearFilter',
									}}
									onClick={handleFilterChange}
									disabled={filterProps.disabled}
								/>
							</TooltipHost>
							<TooltipHost content="Download community as .csv file.">
								{downloadInProgress ? (
									<div>
										<Spinner label="" style={SPINNER_STYLE} />
									</div>
								) : (
									<IconButton
										style={buttonStyle}
										iconProps={{ iconName: 'DownloadDocument' }}
										onClick={handleDownload}
									/>
								)}
							</TooltipHost>
						</FlexySubContainer>
					</div>
				</Grid>
			</FlexyContainer>
		)
	},
)
CommunityOverview.displayName = 'CommunityOverview'

const FlexySubContainer = styled.div`
	display: flex;
`
const FlexyContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px;
	cursor: cell;
	border-radius: 5px;
`

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-column-gap: 5;
	grid-row-gap: 1;
	width: 100%;
`
