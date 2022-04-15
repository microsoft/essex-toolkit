/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEventListener } from './useEventListener.js'

type Scrollistener = (e: Event) => any

/**
 * Adds a scroll listener to the given element
 * @param listener The listener
 * @param element The element to listen for scroll
 * @param deps The list of optional deps
 */
export function useScrollListener(
	listener: Scrollistener,
	element?: HTMLElement | Window | null,
	deps?: any[],
): void {
	useEventListener(
		{
			scroll: listener,
		},
		element,
		deps,
	)
}
