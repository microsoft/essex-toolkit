/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo, useState } from 'react'

import type { CommunityDataProvider } from '../common/dataProviders/index.js'
import type { IEntityDetail } from '../index.js'
import type { IFilterProps } from './interfaces.js'
import { useEntitiesLoadedHandler } from './useEntitiesLoadedHandler.js'
import { useLoadEntitiesOnMountEffect } from './useLoadEntitiesOnMountEffect.js'
import { useLoadInitialEntitiesHandler } from './useLoadInitialEntitiesHandler.js'
import type { IEntityLoadParams } from './useLoadMoreEntitiesHandler.js'
import { useLoadMoreEntitiesHandler } from './useLoadMoreEntitiesHandler.js'

export function useCommunityData(
	dataProvider: CommunityDataProvider,
	isOpenProp: boolean | undefined,
	maxLevel: number,
): [
	// entities
	IEntityDetail[],
	// isloading
	boolean,
	// loadMore
	(
		pageNumber?: number,
		params?: IEntityLoadParams,
	) => Promise<IEntityDetail[]> | undefined,
	// hasMore,
	boolean,
	// isopen
	boolean,
	// filterProps
	() => void,
	// filterProps
	IFilterProps,
] {
	const [filterEntities, setFilterEntities] = useState<boolean>(false)
	const [moreToLoad, setMoreToLoad] = useState(true)
	const [
		entities,
		handleEntitiesLoaded,
		clearEntities,
		setLoading,
		isLoading,
		entitiesLoaded,
	] = useEntitiesLoadedHandler(false)
	const [isOpen, setIsOpen] = useState(isOpenProp || false)
	const setMoreDataToLoad = useCallback(
		(state: boolean) => {
			setMoreToLoad(state)
		},
		[setMoreToLoad],
	)
	const loadMore = useLoadMoreEntitiesHandler(
		entities,
		moreToLoad,
		setMoreDataToLoad,
		handleEntitiesLoaded,
		dataProvider,
		isLoading,
	)

	const loadInitialEntities = useLoadInitialEntitiesHandler(
		handleEntitiesLoaded,
		isLoading,
		dataProvider,
	)

	useLoadEntitiesOnMountEffect(
		loadInitialEntities,
		isOpen,
		entitiesLoaded,
		dataProvider.size,
	)

	const toggleOpen = useCallback(() => {
		setIsOpen(!isOpen)
	}, [isOpen, setIsOpen])
	const toggleFilter = useCallback(() => {
		clearEntities(true) // reset offset
		setMoreToLoad(true)
		setFilterEntities(!filterEntities)
		setLoading(false)
		dataProvider.setFilterEntities(!filterEntities)
	}, [
		filterEntities,
		setFilterEntities,
		clearEntities,
		dataProvider,
		setLoading,
	])

	const filterProps: IFilterProps = useMemo(() => {
		const disabled = maxLevel === dataProvider.level || false
		return { disabled, state: filterEntities, toggleFilter }
	}, [maxLevel, toggleFilter, filterEntities, dataProvider])

	return [
		entities,
		isLoading,
		loadMore,
		moreToLoad,
		isOpen,
		toggleOpen,
		filterProps,
	]
}
