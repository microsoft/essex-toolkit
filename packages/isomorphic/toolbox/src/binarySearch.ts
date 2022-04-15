/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// Hackerrank.com? shows up on bing if I search for binary search

/**
 * Performs numerical comparison
 */
export function DEFAULT_COMPARE<T>(item1: T, item2: T): number {
	if (item1 < item2) {
		return -1
	} else if (item1 > item2) {
		return 1
	}
	return 0
}

/**
 * Performs a binary search on the given array
 * @param array The array of numbers to search
 * @param item The item to look for
 * @returns index of found item
 */
export function binarySearch<T = number>(
	array: T[],
	item: T,
	compare = DEFAULT_COMPARE,
): number {
	function binarySearchRec(left: number, right: number): number {
		const mid = Math.floor((left + right) / 2)
		if (left > right) {
			return -1
		}
		if (compare(array[mid], item) === 0) {
			return mid
		}
		if (compare(array[mid], item) > 0) {
			return binarySearchRec(left, mid - 1)
		}
		return binarySearchRec(mid + 1, right)
	}
	return binarySearchRec(0, array.length - 1)
}
