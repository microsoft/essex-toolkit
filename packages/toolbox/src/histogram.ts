/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * The Bin holds an array of values that match the bounding criteria,
 * along with an additional pair of properties indicating that bounding.
 */
export interface Bin extends Array<number> {
	/**
	 * Minimum _computed_ value for the bin
	 */
	x0: number
	/**
	 * Maximum _computed_ value for the bin
	 */
	x1: number
}

/**
 * A Histogram is just an array of Bins.
 * This follows the d3 format, so these outputs can be used as drop-ins to
 * any code that expects a d3-style histogram.
 */
export type Histogram = Array<Bin>

const extent = (values: number[]) =>
	values.reduce(
		(acc, cur) => [Math.min(acc[0], cur), Math.max(acc[1], cur)],
		[Number.MAX_VALUE, Number.MIN_VALUE],
	)

const standardHistogram = (
	data: any[],
	bins: number,
	accessor = (d: any) => d,
): Histogram => {
	const values = data.map((d) => accessor(d))
	const ext = extent(values)
	const [min, max] = ext
	const range = max - min
	const binSize = range / bins
	const binStructure = new Array(bins).fill(1).map((d, i) => {
		const bin: any = []
		bin.x0 = binSize * i + min
		bin.x1 = binSize * (i + 1) + min
		return bin
	})
	const histo = values.reduce((acc, cur) => {
		const index = binStructure.findIndex(
			(bin) => cur >= bin.x0 && cur <= bin.x1,
		)
		acc[index < 0 ? acc.length - 1 : index].push(cur)
		return acc
	}, binStructure)
	return histo
}

const findForwardBreak = (data: number[], start: number) => {
	const value = data[start - 1]
	for (let i = start; i < data.length; i++) {
		if (data[i] !== value) {
			return i - start
		}
	}
	return data.length - start
}

const findBackwardBreak = (data: number[], start: number) => {
	const value = data[start - 1]
	for (let i = start - 1; i >= 0; i--) {
		if (data[i] !== value) {
			return start - i - 1
		}
	}
	return start
}

/**
 * Quantize a list of data values into n bins
 * This adds a correction to make sure bins don't break on the same value,
 * so that values only have one correct bin to lie within.
 * Some distributions need this correction because they have such an extreme shape (e.g., zipf)
 * @param data
 * @param bins
 */
const quantizeHistogram = (
	data: any[],
	bins: number,
	accessor = (d: any) => d,
	smooth?: boolean,
): Histogram => {
	const values = data
		.map((d: any) => accessor(d))
		.sort((a: number, b: number) => a - b)
	let binLength = Math.ceil(values.length / bins) // starting bin length is always the ideal
	const binStructure: any = []
	let start = 0
	for (let i = 0; i < bins; i++) {
		const end = start + binLength
		const forward = findForwardBreak(values, end)
		const backward = findBackwardBreak(values, end)
		const moveBackward = backward < forward && backward < binLength
		const newEnd = smooth && moveBackward ? end - backward : end + forward
		const bin: any = values.slice(start, newEnd)
		if (bin.length > 0) {
			bin.x0 = bin[0]
			bin.x1 = bin[bin.length - 1]
			binStructure.push(bin)
		}

		start = newEnd
		// recalculate bin length with remaining values and bins, in case a really large bin skewed everything
		if (newEnd !== end) {
			binLength = Math.ceil((values.length - newEnd) / (bins - (i + 1)))
		}
	}
	return binStructure
}

/**
 * Creates a histogram from an array of objects.
 * The histogram will be populated with numeric values.
 * If your input data is not numeric, supply an accessor function.
 * By default, a standard equal-interval histogram will be created.
 * If the quantize parameter is set, it will instead use quantiles (i.e., equal-length bins).
 * If you are quantizing, you can also set a smooth parameter to indicate that breaks in the data should try to minimize variance.
 *
 * Note on quantiles: the bin count and length are ideals, but not guaranteed.
 * The way the quantiles are calculated, a precise number of bins can't be guaranteed unless you will accept empty bins.
 * For example, if your dataset is [1,1,1,1,1,2,2], you will always only get back two bins.
 * Depending on the data distribution, we also may not be able to assure each bin is the same length as the others.
 * Using the same example dataset, here we would have one bin with 5 items, and the other with 2.
 * We _could_ split them evenly and put some of the 1s in the 2 bin, but that seems less preferable.
 *
 */
export const histogram = (
	data: any[],
	bins: number,
	accessor = (d: any) => d,
	quantize?: boolean,
	smooth?: boolean,
): Histogram => {
	return quantize
		? quantizeHistogram(data, bins, accessor, smooth)
		: standardHistogram(data, bins, accessor)
}
