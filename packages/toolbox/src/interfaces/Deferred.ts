/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface Deferred<PromiseType> /*extends Promise<PromiseType>*/ {
	/**
	 * Returns a promise for this deferred
	 */
	promise: Promise<PromiseType>

	/**
	 * Resolves the deferred
	 * @param args - The args to resolve the deferred with
	 */
	resolve(...args: any[]): Promise<PromiseType>

	/**
	 * Rejects the deferred
	 * @param args - The args to reject the deferred with
	 */
	reject(...args: any[]): Promise<PromiseType>
}
