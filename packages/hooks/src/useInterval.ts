/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useRef } from 'react'

const noop: () => void = () => null

/**
 * Creates an interval with the specified delay, and clears it on unmount.
 * @param callback - function to run on interval
 * @param delay - ms delay to run callback at
 */
export const useInterval = (callback: () => void, delay: number): void => {
	const savedCallback = useRef(noop)

	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	useEffect(() => {
		const tick = () => {
			savedCallback.current()
		}
		if (delay !== null) {
			const id = setInterval(tick, delay)
			return () => clearInterval(id)
		}
	}, [delay])
}
