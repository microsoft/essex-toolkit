/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
interface RGB {
	r: number
	g: number
	b: number
}
/**
 * Creates RGB color object from HEX color string
 * @param color HEX color string
 * @returns rgb color object {r:number, g: number, b:number}
 */

export function parseRgbFromCssColor(color: string): RGB {
	color = color.replace('#', '') // strip of leading # if necessary
	const colorNumber = parseInt(color, 16)
	return {
		r: colorNumber >> 16,
		g: (colorNumber >> 8) & 255,
		b: colorNumber & 255,
	}
}
