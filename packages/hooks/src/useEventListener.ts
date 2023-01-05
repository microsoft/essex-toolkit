/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'

interface ListenerMap {
	keydown?: (event: KeyboardEvent) => any
	keyup?: (event: KeyboardEvent) => any
	keypress?: (event: KeyboardEvent) => any

	mousedown?: (event: MouseEvent) => any
	mouseup?: (event: MouseEvent) => any
	mousemove?: (event: MouseEvent) => any

	[key: string]: ((event: any) => any) | undefined
}

/**
 * Adds various listeners to the given element and cleans them up when done
 * @param listenerMap - The listeners
 * @param element - The element to attach the listeners to
 * @param deps - The optional list of dependencies
 */
export function useEventListener(
	listenerMap: ListenerMap,
	element: HTMLElement | Window | null | undefined,
	...deps: any[]
): void {
	useEffect(() => {
		if (element) {
			const listeners = Object.keys(listenerMap || {}).map((evt) => {
				const listener = (listenerMap as any)[evt]
				element.addEventListener(evt, listener)

				// I explictly don't use listener map to keep track of the listeners,
				// because they could mutate it
				return {
					event: evt,
					listener,
				}
			})
			return () => {
				listeners.forEach(({ event, listener }) => {
					element.removeEventListener(event, listener)
				})
			}
		}
	}, [element, listenerMap])
}
