/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

type isEqual = (item: any, item2: any) => boolean
type ClickHandler<T> = (item?: T) => any

/**
 * Provides basic selection handling,
 * @param equal - A object equality function
 * @param singleSelect - If it should operate in single select mode
 * @returns The list of selected objects and a handler for adding new selections
 */
export function useSelectionHandler<T>(
	equal: isEqual,
	singleSelect: boolean,
): [T[], ClickHandler<T>] {
	const [selectedObjects, setSelectedObjects] = useState([] as T[])
	const clickHandler = useCallback(
		(newObj) => {
			const newSelection = [] as T[]
			if (newObj) {
				newSelection.push(...selectedObjects)
				const hasItem = selectedObjects.some((selObj, i) => {
					// The user reclicked on the item, remove it from the list
					if (equal(selObj, newObj)) {
						newSelection.splice(i, 1)
						return true
					}
					return false
				})

				// Didn't find the item, add it to our list
				if (!hasItem) {
					singleSelect
						? newSelection.unshift(newObj)
						: newSelection.push(newObj)
				}

				if (singleSelect && newSelection.length > 1) {
					newSelection.length = 1
				}

				setSelectedObjects(newSelection)
			} else {
				setSelectedObjects([])
			}
			return newSelection
		},
		[equal, selectedObjects, singleSelect],
	)
	return [selectedObjects, clickHandler] as [T[], ClickHandler<T>]
}
