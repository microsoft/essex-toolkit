/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debounce from 'lodash-es/debounce.js'
import type { MutableRefObject } from 'react'
import { useState } from 'react'

import { useEventListener } from './useEventListener.js'

interface Position {
	x: number
	y: number
}
/**
 * Gets the current mouse position on the given element
 * @param ref - The ref to the element
 * @param debouceTime - The amount of time to wait between state updates
 * @returns The current mouse position
 */
export function useMousePosition(
	ref: MutableRefObject<HTMLElement | null>,
	debouceTime = 100,
): Position {
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
	useEventListener(
		{
			mousemove: debounce(event => {
				setPosition({
					x: event.offsetX,
					y: event.offsetY,
				})
			}, debouceTime),
		},
		ref.current,
		ref.current,
	)
	return position
}
