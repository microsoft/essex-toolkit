/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback, useMemo } from 'react'
import { IEntityDetail } from '..'
import { CommunityDataProvider } from '../common/dataProviders'
import { IFilterProps } from './interfaces'
import { useEntitiesLoadedHandler } from './useEntitiesLoadedHandler'
import { useLoadEntitiesOnMountEffect } from './useLoadEntitiesOnMountEffect'
import { useLoadInitialEntitiesHandler } from './useLoadInitialEntitiesHandler'
import {
	IEntityLoadParams,
	useLoadMoreEntitiesHandler,
} from './useLoadMoreEntitiesHandler'

export function useCommunityData(
	isOpenProp: boolean | undefined,
	maxLevel: number,
	size: number,
	dataProvider?: CommunityDataProvider,
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
		size,
	)

	const toggleOpen = useCallback(() => {
		setIsOpen(!isOpen)
	}, [isOpen, setIsOpen])
	const toggleFilter = useCallback(async () => {
		clearEntities(true) // reset offset
		setMoreToLoad(true)
		setFilterEntities(!filterEntities)
		setLoading(false)
		dataProvider && dataProvider.setFilterEntities(!filterEntities)
	}, [
		filterEntities,
		setFilterEntities,
		clearEntities,
		dataProvider,
		setLoading,
	])

	const filterProps: IFilterProps = useMemo(() => {
		const disabled = (dataProvider && maxLevel === dataProvider.level) || false
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
