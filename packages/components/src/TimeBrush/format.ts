/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import moment from 'moment'

export function date(d: string | number): string {
	return moment.utc(d).format('MMM Do YYYY, hh:mma')
}

export function isoDay(d: string | number | Date): string {
	return moment.utc(d).format('YYYY-MM-DD')
}

export function truncate(text: string, length: number): string {
	return text.length <= length ? text : `${text.substr(0, length - 3)}...`
}

export function domain(url: string): string {
	return (url || '').replace(/www\./, '')
}

/**
 * Pretty print a very long number into something more friendly.
 * Sort of like d3-format but for simple numbers instead of science.
 * TODO: this could be fancy enough to take in a max length and compute from there.
 * @param d
 */
export function longNumber(d: number): string {
	const str = `${d}`
	const l = str.length
	if (l < 5) {
		return str
	} else if (l < 7) {
		return `${Math.round(d / 1000)}k`
	} else if (l < 10) {
		return `${Math.round(d / 100000) / 10}m`
	} else if (l < 13) {
		return `${Math.round(d / 100000000) / 10}b`
	} else if (l < 16) {
		return `${Math.round(d / 100000000000) / 10}t`
	}
	return str
}

/**
 * Basic pluralizer, only works if you can plainly append the suffix (e.g., 's')
 * @param word
 * @param count
 */
export function plural(word: string, count: number, suffix = 's'): string {
	return `${word}${count === 1 ? '' : suffix}`
}
