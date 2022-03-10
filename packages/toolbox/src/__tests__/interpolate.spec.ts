/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { interpolate } from '../interpolate.js'

const data = [0, 12, 24, 36, 48]

describe('interpolate numbers', () => {
	it('multiple of 1 should return a copy of the same array', () => {
		expect(interpolate(data, 1)).toEqual(data)
	})
	it('multiple of 2 should insert one between each', () => {
		expect(interpolate(data, 2)).toEqual([0, 6, 12, 18, 24, 30, 36, 42, 48])
	})
	it('multiple of 3 should insert two between each', () => {
		expect(interpolate(data, 3)).toEqual([
			0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48,
		])
	})
	it('accessor output should be used if provided', () => {
		expect(interpolate(data, 1, (d: number) => d + 1)).toEqual([
			1, 13, 25, 37, 49,
		])
	})
})
