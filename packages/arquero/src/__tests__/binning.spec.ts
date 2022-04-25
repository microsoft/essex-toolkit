/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { fixedBinCount, fixedBinStep } from '../binning.js'

describe('binning expressions', () => {
	describe('out of bounds and clamping', () => {
		test('10 bins, out of bounds become Infinity', () => {
			const tbl = table({
				num: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			})
			const expr = fixedBinCount('num', 0, 10, 10, false, false)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe(Number.NEGATIVE_INFINITY)
			expect(get(5)).toBe(5)
			expect(get(11)).toBe(Number.POSITIVE_INFINITY)
		})

		test('10 bins clamped, out of bounds map to min/max', () => {
			const tbl = table({
				num: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			})
			const expr = fixedBinCount('num', 0, 10, 10, true, false)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe(0)
			expect(get(5)).toBe(5)
			expect(get(11)).toBe(9)
		})
	})

	describe('fixed bin count', () => {
		test('2 bins', () => {
			const tbl = table({
				num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			})
			const expr = fixedBinCount('num', 0, 10, 2, false, false)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe(0)
			expect(get(5)).toBe(5)
			// max should be pushed down into top bin inclusive
			expect(get(9)).toBe(5)
		})

		test('10 bins', () => {
			const tbl = table({
				num: [1, 2, 3.5, 4, 5, 6, 7, 8, 9, 10],
			})
			const expr = fixedBinCount('num', 0, 10, 10, false, false)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe(1)
			expect(get(5)).toBe(6)
			expect(get(9)).toBe(9)
		})
	})

	describe('fixed bin step', () => {
		test('2 step', () => {
			const tbl = table({
				num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			})
			const expr = fixedBinStep('num', 0, 10, 2, false, false)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe(0)
			expect(get(1)).toBe(2)
			expect(get(2)).toBe(2)
			expect(get(3)).toBe(4)
			expect(get(4)).toBe(4)
			expect(get(5)).toBe(6)
			expect(get(6)).toBe(6)
			expect(get(7)).toBe(8)
			expect(get(8)).toBe(8)
			expect(get(9)).toBe(8)
		})
	})

	describe('range printing', () => {
		test('10 bins, within bounds', () => {
			const tbl = table({
				num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			})
			const expr = fixedBinCount('num', 0, 10, 10, false, true)
			const result = tbl.derive({
				bin_num: fixedBinCount('num', 0, 10, 10, false, false),
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe('1 to <2')
			expect(get(5)).toBe('6 to <7')
			expect(get(9)).toBe('9 to 10')
		})

		test('10 bins, out of bounds', () => {
			const tbl = table({
				num: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			})
			const expr = fixedBinCount('num', 0, 10, 10, false, true)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe('<0')
			expect(get(5)).toBe('5 to <6')
			expect(get(11)).toBe('>10')
		})

		test('10 bins, clamped', () => {
			const tbl = table({
				num: [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			})
			const expr = fixedBinCount('num', 0, 10, 10, true, true)
			const result = tbl.derive({
				bin: expr,
			})
			const get = result.getter('bin')
			expect(get(0)).toBe('0 to <1')
			expect(get(5)).toBe('5 to <6')
			expect(get(11)).toBe('9 to 10')
		})
	})
})
