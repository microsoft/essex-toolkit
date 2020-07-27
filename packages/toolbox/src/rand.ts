/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Generates a number as close to zero but not exactly zero
 * @param factor
 */
export function jiggle(factor = 1e-6): number {
	return (Math.random() - 0.5) * factor
}

/**
 * Generates a random number between a maximim and minimum value inclusive
 * @param min The minimum value
 * @param max The maximum value
 */
export function randBetween(min: number, max: number): number {
	return Math.random() * (max - min) + min
}
