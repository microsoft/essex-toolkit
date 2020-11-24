/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ITextProps } from '@fluentui/react'
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
	data: IEntityDetail[]
	error: Error | null | undefined
}

export interface IHierarchyNeighborResponse {
	data: INeighborCommunityDetail[]
	error: Error | null | undefined
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
	(params: ILoadParams, communityId: CommunityId): Promise<
		IHierarchyNeighborResponse
	>
}
export interface ICardOverviewSettings {
	header?: ITextProps['variant']
	subheader?: ITextProps['variant']
}

export interface ITableSettings {
	header?: ITextProps['variant']
	subheader?: ITextProps['variant']
	tableItems?: ITextProps['variant']
}
export interface IStyles {
	cardOverview: ICardOverviewSettings
	table: ITableSettings
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
