/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Spinner, TooltipHost, Text } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { CommunityId, IControls, IEntityDetail } from '..'
import { MagBar } from '../MagBar'
import { paddingLeft, headerLabel, subHeaderLabel } from '../common/styles'
import { IFilterProps } from '../hooks/interfaces'
import { useThemesStyle } from '../hooks/theme'
import {
	useCommunityLevelText,
	useCommunityText,
} from '../hooks/useCommunityDetails'
import { useCommunityDownload } from '../hooks/useCommunityDownload'
import { useControls } from '../hooks/useControls'
import { IEntityLoadParams } from '../hooks/useLoadMoreEntitiesHandler'
import { ICardOverviewSettings } from '../types'

export interface ICommunityOverviewProps {
	communityId: CommunityId
	size: number
	sizePercent: number
	incrementLevel?: boolean // adjust from 0 to 1 based indexing on levels if needed
	onToggleOpen: () => void
	filterProps: IFilterProps
	getEntityCallback: (
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined
	level: number
	styles?: ICardOverviewSettings
	controls?: IControls
	neighborSize?: number
}
const DEFAULT_MAGBAR_WIDTH = 120
const SPINNER_STYLE = { marginLeft: 17 }
export const CommunityOverview: React.FC<ICommunityOverviewProps> = memo(
	function CommunityOverview({
		communityId,
		size,
		sizePercent,
		incrementLevel,
		onToggleOpen,
		filterProps,
		getEntityCallback,
		level,
		styles,
		controls,
		neighborSize,
	}: ICommunityOverviewProps) {
		const levelLabel = useCommunityLevelText(level, incrementLevel)

		const style = useThemesStyle(styles)
		const buttonStyle = useMemo(() => styles?.iconButton || {}, [styles])

		const headerStyle = useMemo(
			(): React.CSSProperties => styles?.header || {},
			[styles],
		)
		const subheaderStyle = useMemo(
			(): React.CSSProperties => styles?.subheader || {},
			[styles],
		)

		const headerVariant = useMemo(() => styles?.headerText || headerLabel, [
			styles,
		])
		const subheaderVariant = useMemo(
			() => styles?.subHeaderText || subHeaderLabel,
			[styles],
		)

		const { showLevel, showMembership, showFilter, showExport } = useControls(
			controls,
		)
		const communityText = useCommunityText(communityId)

		const handleFilterChange = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				event.stopPropagation()
				filterProps.toggleFilter()
			},
			[filterProps],
		)

		const [handleDownload, downloadInProgress] = useCommunityDownload(
			communityId,
			size,
			getEntityCallback,
			level,
		)

		return (
			<FlexyContainer
				onClick={onToggleOpen}
				style={style}
				className={'cardoverview-root'}
			>
				<Grid>
					<GridItem1>
						<Divider className={'cardoverview-header'} style={headerStyle}>
							<Text variant={headerVariant}>
								<Bold>{communityText}</Bold>
							</Text>
						</Divider>
						{showLevel ? (
							<Divider
								className={'cardoverview-subheader'}
								style={subheaderStyle}
							>
								<Text variant={subheaderVariant}>{levelLabel}</Text>
							</Divider>
						) : null}
					</GridItem1>
					{neighborSize && neighborSize > 0 ? (
						<GridItem2>
							<TooltipHost content="Number of neighboring (connected) communities.  Members of neighboring communities may be related, but are less tightly connected that those within the community.">
								<Divider
									className={'cardoverview-subheader'}
									style={subheaderStyle}
								>
									<Text
										variant={subheaderVariant}
									>{`Neighbors: ${neighborSize}`}</Text>
								</Divider>
								<HeightSpacer />
							</TooltipHost>
						</GridItem2>
					) : null}
					<GridItem3>
						<FlexySubContainer>
							{size && showMembership ? (
								<Divider>
									<Divider
										className={'cardoverview-subheader'}
										style={subheaderStyle}
									>
										<Text variant={subheaderVariant}>
											Members: {size.toLocaleString()}
										</Text>
									</Divider>
									<MagBar percent={sizePercent} width={DEFAULT_MAGBAR_WIDTH} />
								</Divider>
							) : null}
							{showFilter ? (
								<TooltipHost
									content={`Show only unique entities between level ${level} and ${
										level + 1
									}.`}
								>
									<IconButton
										styles={buttonStyle}
										iconProps={{
											iconName: filterProps.state ? 'Filter' : 'ClearFilter',
										}}
										onClick={handleFilterChange}
										disabled={filterProps.disabled}
									/>
								</TooltipHost>
							) : null}
							{showExport ? (
								<TooltipHost content="Download community as .csv file.">
									{downloadInProgress ? (
										<Spinner label="" style={SPINNER_STYLE} />
									) : (
										<IconButton
											styles={buttonStyle}
											iconProps={{ iconName: 'DownloadDocument' }}
											onClick={handleDownload}
										/>
									)}
								</TooltipHost>
							) : null}
						</FlexySubContainer>
					</GridItem3>
				</Grid>
			</FlexyContainer>
		)
	},
)
const Divider = styled.div``

const Bold = styled.div`
	font-weight: bold;
`

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

const GridItem1 = styled.div`
	margin-left: ${paddingLeft};
	grid-row: 1;
	grid-column: 1;
`
const GridItem2 = styled.div`
	grid-row: 1;
	grid-column: 2;
	justify-self: center;
`
const HeightSpacer = styled.div`
	visibility: hidden;
	height: 10px;
`
const GridItem3 = styled.div`
	grid-row: 1;
	grid-column: 3;
	justify-self: end;
`
