/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// https://stackoverflow.com/questions/27078285/simple-throttle-in-js

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export interface ThrottleOptions {
	leading: boolean
	trailing: boolean
}
/**
 * Debounces function based on options provided
 * @param func - function to throttle
 * @param wait - time in milliseconds
 * @param options - optional object param to control timing, ex. \{trailing: false, leading: true\}
 */
export function throttle(
	func: (...args: any[]) => any,
	wait = 100,
	options?: ThrottleOptions,
): any {
	let context: any
	let lastArgs: any
	let result: any
	let timeout: any = null
	let previous = 0
	const currentOptions: ThrottleOptions = options
		? options
		: { leading: false, trailing: false }

	const later = function (): void {
		previous = currentOptions.leading === false ? 0 : Date.now()
		timeout = null
		result = func.apply(context, lastArgs)
		if (!timeout) {
			context = lastArgs = null
		}
	}
	return function (this: any, ...args: any[]) {
		const now = Date.now()
		if (!previous && currentOptions.leading === false) {
			previous = now
		}
		const remaining = wait - (now - previous)
		context = this
		lastArgs = args
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			previous = now
			result = func.apply(context, lastArgs)
			if (!timeout) {
				context = lastArgs = null
			}
		} else if (!timeout && currentOptions.trailing !== false) {
			timeout = setTimeout(later, remaining)
		}
		return result
	}
}
