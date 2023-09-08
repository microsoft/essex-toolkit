/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupedTerm } from './TimeBrush.types.js'
import { isoDay } from './format.js'
import { line, svg, text } from '@thematic/d3'
import { select } from 'd3-selection'
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

export function createPlot(
	ref: any,
	theme: any,
	width: number,
	height: number,
): any {
	select(ref.current).select('svg').remove()
	const g = select(ref.current)
		.append('svg')
		.attr('class', 'BottomTimeBrush-chart')
		.attr('width', width)
		.attr('height', height)
		.call(svg as any, theme.chart())
		.append('g')
		.attr('class', 'BottomTimeBrush-plotarea')
	return g
}

export function createBarGroup(g: any): any {
	return g.append('g').attr('class', 'BottomTimeBrush-bars')
}

export function selectAll(
	data: GroupedTerm[],
	barGroup: any,
	xScale: any,
	height: number,
	theme: any,
	SelectionState: any,
	barWidth: number,
) {
	if (data.length > 0) {
		if (barGroup) {
			barGroup.selectAll('*').remove()
			barGroup
				.selectAll('.bar')
				.data(data)
				.enter()
				.append('line')
				.attr('class', 'bar')
				.attr('x1', xScale)
				.attr('x2', xScale)
				.attr('y1', 0)
				.attr('y1', height)
				.call(
					line as any,
					theme.line({ selectionState: SelectionState.NoData }),
				)
				.attr('stroke-width', barWidth)
		}
	}
}

export function changePlot(
	plot: any,
	dateRange: [Date, Date],
	height: number,
	theme: any,
	width: number,
) {
	if (plot) {
		plot
			.append('text')
			.attr('class', 'hover-label')
			.text(isoDay(dateRange[0]))
			.attr('transform', `translate(2,${height - 2})`)
			.call(text as any, theme.text())
			.attr('font-size', 8)
		plot
			.append('text')
			.attr('class', 'hover-label')
			.text(isoDay(dateRange[1]))
			.attr('transform', `translate(${width - 2},${height - 2})`)
			.call(text as any, theme.text())
			.attr('font-size', 8)
			.attr('text-anchor', 'end')
	}
}

export function selectAllPlot(
	plot: any,
	internalBrushRange: [Date, Date] | null,
	xScale: any,
	theme: any,
) {
	if (plot) {
		plot.selectAll('.brush-label').remove()
		if (internalBrushRange) {
			const [start, end] = internalBrushRange
			const sx = xScale(start)
			const ex = xScale(end)
			plot
				.append('text')
				.attr('class', 'brush-label')
				.text(isoDay(start))
				.attr('transform', `translate(${sx},${8})`)
				.call(text as any, theme.text())
				.attr('font-size', 8)
				.attr('text-anchor', 'end')
			plot
				.append('text')
				.attr('class', 'brush-label')
				.text(isoDay(end))
				.attr('transform', `translate(${ex},${8})`)
				.call(text as any, theme.text())
				.attr('font-size', 8)
		}
	}
}
