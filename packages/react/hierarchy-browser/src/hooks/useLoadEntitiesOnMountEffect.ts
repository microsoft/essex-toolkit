/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'

import type { ILoadParams } from '../index.js'

export function useLoadEntitiesOnMountEffect(
	loadInitialEntities: (
		page?: number,
		params?: ILoadParams,
		init?: boolean,
	) => void,
	isOpen: boolean,
	entitiesLoaded: boolean,
	size = 0,
): void {
	useEffect(() => {
		if (isOpen && !entitiesLoaded && size > 0) {
			loadInitialEntities()
		}
	}, [entitiesLoaded, isOpen, loadInitialEntities, size])
}

export function useLoadCommunitiesOnMountEffect(
	loadInitialEntities: (
		page?: number,
		params?: ILoadParams,
		init?: boolean,
	) => void,
	isOpen: boolean,
	entitiesLoaded: boolean,
	refresh: boolean,
): void {
	useEffect(() => {
		if (isOpen && !entitiesLoaded) {
			loadInitialEntities()
		}
	}, [refresh, isOpen, entitiesLoaded, loadInitialEntities])
}
