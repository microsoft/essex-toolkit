/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Deferred } from './interfaces/Deferred.js'
/**
 * Represents a deferred object, which can be resolved
/*

/**
 * Creates a new deferred promise
 * @returns Promise
 */
export function deferred<T>(): Deferred<T> {
	let resolveFn: any
	let rejectFn: any
	const myPromise = new Promise<T>((resolve, reject) => {
		resolveFn = resolve
		rejectFn = reject
	})

	return {
		resolve(...args: any[]) {
			resolveFn.call(null, ...args)
			return myPromise
		},
		reject(...args: any[]) {
			rejectFn.call(null, ...args)
			return myPromise
		},
		get promise() {
			return myPromise
		},
	} as Deferred<T>
}
