/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Performs function debouncing for events
 * @param callback function for debouncing
 * @param delay number of milliseconds delay
 */

export function debounce(
	callback: (...args: any[]) => any,
	delay = 100,
): (this: any, ...args: any[]) => any {
	let timer: any
	return function (this: any, ...args: any[]) {
		if (timer) {
			clearTimeout(timer)
		}
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		timer = setTimeout(() => {
			timer = null as any
			;(callback as any).call(that, ...args)
		}, delay)
	}
}
