/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupedTerm } from './TimeBrush.types.js'
import { line, rect, svg } from '@thematic/d3'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'

export function createBarGroup(
	ref: any,
	theme: any,
	width: number,
	height: number,
): any {
	select(ref.current).select('svg').remove()
	const g = select(ref.current)
		.append('svg')
		.attr('class', 'sparkbar-chart')
		.attr('width', width)
		.attr('height', height)
		.call(svg as any, theme.chart())
		.append('g')
		.attr('class', 'sparkbar-plotarea')
	g.append('rect')
		.attr('width', width)
		.attr('height', height)
		.call(rect as any, theme.plotArea())
	return g.append('g').attr('class', 'sparkbar-bars')
}

export function generate(
	barGroup: any,
	data: GroupedTerm[],
	nodataFn: any,
	value: any,
	height: number,
	xScale: any,
	barWidth: number,
	barGap: number,
	theme: any,
) {
	if (data.length > 0) {
		const ext = data.reduce<[number, number]>(
			(acc: any, cur: any) => {
				if (!nodataFn(cur)) {
					const val = value(cur)
					return [Math.min(acc[0], val), Math.max(acc[1], val)]
				}
				return acc
			},
			[Number.MAX_VALUE, Number.MIN_VALUE],
		)
		const hScale = scaleLinear().domain(ext).range([0, height])
		const x = xScale ? xScale : (d: any, i: any) => i * (barWidth + barGap)
		const h = (d: any) => (nodataFn(d) ? height : hScale(value(d)))
		const y = (d: any) => height - (h(d) || 0)

		if (barGroup) {
			barGroup.selectAll('*').remove()
			barGroup
				.selectAll('.bar')
				.data(data)
				.enter()
				.append('line')
				.attr('class', 'bar')
				.attr('x1', x)
				.attr('x2', x)
				.attr('y1', y)
				.attr('y2', height)
				.call(line as any, theme.line())
				.attr('stroke-width', barWidth)
		}
	}
}

export function selectBarGroup(barGroup: any, handleHover: any, onClick: any) {
	if (barGroup) {
		barGroup
			.selectAll('.bar')
			.on('mouseover', (d: any) => handleHover(d))
			.on('mouseout', () => handleHover(null))
			.on('click', onClick)
	}
}

export function selectAll(barGroup: any, onClick: any) {
	const cursor = onClick ? 'pointer' : 'default'
	if (barGroup) {
		barGroup.selectAll('.bar').style('cursor', cursor)
	}
}

export function markState(
	barGroup: any,
	getSelectionState: any,
	marked: any,
	highlight: any,
	theme: any,
) {
	if (barGroup) {
		barGroup.selectAll('.bar').attr('stroke', (d: any) => {
			const selectionState = getSelectionState(d)
			const mark = marked ? marked(d) : false
			return mark
				? highlight
				: theme
						.line({
							selectionState,
						})
						.stroke()
						.hex()
		})
	}
}
