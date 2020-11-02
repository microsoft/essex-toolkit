/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLayoutEffect } from 'react'
import { ILoadParams } from '..'

export function useLoadEntitiesOnMountEffect(
	loadInitialEntities: (
		page?: number,
		params?: ILoadParams,
		init?: boolean,
	) => void,
	isOpen: boolean,
	entitiesLoaded: boolean,
): void {
	useLayoutEffect(() => {
		if (isOpen && !entitiesLoaded) {
			loadInitialEntities()
		}
	}, [entitiesLoaded, isOpen, loadInitialEntities])
}
