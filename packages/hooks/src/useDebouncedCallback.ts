/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { debounce } from '@essex-js-toolkit/toolbox'
import { useMemo } from 'react'

/**
 * Creates a debounced callback
 * @param callback The callback for when the delay has elapsed
 * @param dependencies The set of dependencies
 * @param delay The delay before the callback is fired
 */
export function useDebouncedCallback(
	callback: (...args: any[]) => any,
	dependencies: any[],
	delay = 100,
): (this: any, ...args: any[]) => void {
	const cb = useMemo(
		() => debounce(callback, delay),
		[
			// eslint-disable-next-line
			...dependencies,
			callback,
			delay,
		],
	)
	return cb
}
