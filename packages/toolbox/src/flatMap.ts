/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Flattens a multi dimensional array
 * @param arr - The multi-dimensional array
 */
export function flatMap(arr: any[][]): any[] {
	const mapped = [] as any[]
	arr.forEach(item => {
		mapped.push(...item)
	})
	return mapped
}
