/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

import type { IEntityDetail } from '../index.js'

export function useEntitiesLoadedHandler(
	initialLoadingState: boolean,
): [
	IEntityDetail[],
	(entities: IEntityDetail[], error?: Error | undefined | string) => void,
	(loading: boolean) => void,
	(loading: boolean) => void,
	boolean,
	boolean,
] {
	const [isLoading, setLoading] = useState(initialLoadingState)
	const [entities, setEntities] = useState<IEntityDetail[]>([])
	const [entitiesLoaded, setEntitiesLoaded] = useState(false)

	const clearEntities = useCallback(
		(loading: boolean) => {
			setEntitiesLoaded(false)
			setEntities([])
		},
		[setEntitiesLoaded, setEntities],
	)

	// control loading state and display entities
	const handleEntitiesLoaded = useCallback(
		(entities: IEntityDetail[], error?: Error | undefined | string) => {
			if (error) {
				console.error(error)
			}
			setEntities(entities)
			setLoading(false)
			setEntitiesLoaded(true)
		},
		[setEntities, setLoading, setEntitiesLoaded],
	)

	return [
		entities,
		handleEntitiesLoaded,
		clearEntities,
		setLoading,
		isLoading,
		entitiesLoaded,
	]
}
