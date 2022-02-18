/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'
import { Destroyable } from './interfaces/index.js'

/**
 * A hook for using a destroyable thing, so when the value changes
 * the previous value is destroyed
 * @param initialValue The initial value
 * @returns The current value as well as a setter for the new value
 */
export function useDestroyable<T extends Partial<Destroyable>>(
	initialValue?: T,
): [T, (state: T) => any] {
	const [state, setState] = useState(initialValue as any)
	const newSetState = useCallback(
		(newState: T) => {
			if (state && state !== newState && state.destroy) {
				state.destroy()
			}
			setState(newState)
		},
		[state],
	)
	return [state, newSetState] as [T, (state: T) => any]
}
