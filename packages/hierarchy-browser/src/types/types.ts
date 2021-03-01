/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IButtonStyles, ITextProps } from '@fluentui/react'
import React from 'react'
export type CommunityId = string
export type EntityId = string

export interface ICommunityDetail {
	communityId: CommunityId
	entityIds?: EntityId[] // only needed if static
	size: number
	neighborSize?: number
}

export interface INeighborCommunityDetail extends ICommunityDetail {
	connections: number
	edgeCommunityId: CommunityId
}

export interface IEntityDetail {
	id: EntityId
	attrs?: { [key: string]: string | number }
}

export interface IHierarchyDataProvider {
	getCommunityData: () => ICommunityDetail[]
}

export interface IHierarchyDataResponse {
	data?: IEntityDetail[]
	error?: Error | null
}

export interface IHierarchyNeighborResponse {
	data?: INeighborCommunityDetail[]
	error?: Error | null
}

export interface ILoadParams {
	communityId: CommunityId
	level: number
	count: number
	offset: number
	filtered: boolean
}

export interface ILoadEntitiesAsync {
	(params: ILoadParams): Promise<IHierarchyDataResponse>
}

export interface ILoadNeighborCommunitiesAsync {
	(params: ILoadParams): Promise<IHierarchyNeighborResponse>
}

export interface ILoadNeighborCommunities {
	(
		params: ILoadParams,
		communityId: CommunityId,
	): Promise<IHierarchyNeighborResponse>
}

// === CUSTOM STYLES
export interface ICardOverviewSettings {
	header?: React.CSSProperties
	headerText?: ITextProps['variant']
	subheader?: React.CSSProperties
	subHeaderText?: ITextProps['variant']
	root?: React.CSSProperties
	iconButton?: IButtonStyles
}
export interface ITableSettings {
	header?: React.CSSProperties
	headerText?: ITextProps['variant']

	subheader?: React.CSSProperties
	subHeaderText?: ITextProps['variant']

	tableItems?: React.CSSProperties
	tableItemsText?: ITextProps['variant']

	root?: React.CSSProperties
	neighborExpandButton?: IButtonStyles
}
export interface IStyles {
	cardOverview?: ICardOverviewSettings
	table?: ITableSettings
}

export interface IControls {
	showLevel?: boolean
	showMembership?: boolean
	showFilter?: boolean
	showExport?: boolean
}

export interface ISettings {
	visibleColumns?: string[]
	styles?: IStyles
	isOpen?: boolean
	minimizeColumns?: boolean
	controls?: IControls
}
