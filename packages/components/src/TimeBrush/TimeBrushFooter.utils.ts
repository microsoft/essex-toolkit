/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import moment from 'moment'

export function round(date: Date): Date {
	const m = moment.utc(date)
	const d = m.date()
	const h = m.hour()
	m.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0)
		.date(h < 12 ? d : d + 1)
	return m.toDate()
}

export function calculateBrush(
	event: any,
	scale: any,
	rounded: boolean,
): [Date, Date] | null {
	// this is a d3 global that is dynamically updated with the events
	const { selection } = event
	if (selection) {
		const start = scale.invert(selection[0])
		const stop = scale.invert(selection[1])
		const roundedStart = rounded ? round(start) : start
		const roundedStop = rounded ? round(stop) : stop
		return [roundedStart, roundedStop]
	}
	return null
}

export function wholeDateRangeSelected(
	[s1, s2]: [Date, Date],
	[d1, d2]: [Date, Date],
): boolean {
	return (
		moment(s1).isSame(moment(d1), 'day') && moment(s2).isSame(moment(d2), 'day')
	)
}
