/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { histogram } from '../histogram'

describe('histograms', () => {
	describe('standard histogram', () => {
		const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		it('bin count should match count param', () => {
			const histo = histogram(data, 10)
			expect(histo).toHaveLength(10)
		})
		it('bins should be equal value range', () => {
			const histo = histogram(data, 10)
			const first = histo[0].x1 - histo[0].x0
			const second = histo[1].x1 - histo[1].x0
			expect(first).toEqual(second)
		})
		it('total property should match data length', () => {
			const histo = histogram(data, 10)
			const total = histo.reduce((acc, cur) => acc + cur.length, 0)
			expect(total).toEqual(data.length)
		})
	})
	describe('quantized histogram', () => {
		const data = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4]
		it('given sample dataset, asking for 10 bins should result in 4', () => {
			const histo = histogram(data, 10, d => d, true)
			expect(histo).toHaveLength(4)
		})
		it('given sample dataset, asking for 3 bins should result in 3', () => {
			const histo = histogram(data, 3, d => d, true)
			expect(histo).toHaveLength(3)
		})
		it('given sample dataset, asking for 2 bins should result in 2', () => {
			const histo = histogram(data, 2, d => d, true)
			expect(histo).toHaveLength(2)
		})
		it('total property should match data length', () => {
			const histo = histogram(data, 10, d => d, true)
			const total = histo.reduce((acc, cur) => acc + cur.length, 0)
			expect(total).toEqual(data.length)
		})
	})
})
