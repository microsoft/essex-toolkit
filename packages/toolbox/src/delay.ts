/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Returns a promise that will resolve after the given delay, useful for async/await
 * i.e.
 * 	await delay(100)
 *  execute()
 * @param myDelay - The delay to use
 */
export function delay(myDelay: number): Promise<any> {
	return new Promise((resolve) => {
		setTimeout(resolve, myDelay)
	})
}
