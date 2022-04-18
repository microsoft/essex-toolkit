/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Interpolates a data list, filling in the specified multiple.
 * This returns a list of numberic values.
 * The input does not have to be numeric, but if it isn't an accessor function should be supplied.
 * Note that this just performs linear interpolation
 * @param data - Array of objects to compute interpolated values for
 * @param multiple - Multiplier, e.g., 2 means to "double" the length of the array by puttting a value between each value
 * @param accessor - Accessor function to return a numeric property value, if the input data is not numeric
 */
export const interpolate = (
	data: any[],
	multiple: number,
	accessor = (d: any) => d,
): number[] => {
	return data.reduce((acc, cur, idx, arr) => {
		const a = cur
		const b = arr[idx + 1]
		const av = accessor(a) as number
		if (b) {
			const bv = accessor(b)
			const delta = bv - av
			const part = delta / multiple
			const parts = []
			for (let i = 0; i < multiple; i++) {
				parts.push(av + part * i)
			}
			return [...acc, ...parts]
		}
		return [...acc, av]
	}, [])
}
