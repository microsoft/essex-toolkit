/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { binarySearch } from '../binarySearch'

describe('binarySearch', () => {
	it('should return -1 for an empty array', () => {
		expect(binarySearch([], 100)).toEqual(-1)
	})
	it('should return -1 if the value does not exist in a one element array', () => {
		expect(binarySearch([10], 100)).toEqual(-1)
	})
	it('should return 0 if the value exists in a one element array', () => {
		expect(binarySearch([100], 100)).toEqual(0)
	})
	it('should return 1 if the value is the second element in a two element array', () => {
		expect(binarySearch([0, 100], 100)).toEqual(1)
	})
	it('should return 2 if the value is the third element in a three element array', () => {
		expect(binarySearch([0, 50, 100], 100)).toEqual(2)
	})
	it('should return -1 if the value is between the first and third element', () => {
		expect(binarySearch([0, 100], 50)).toEqual(-1)
	})
})
