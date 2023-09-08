/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { line, svg, text } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { brushX } from 'd3-brush'
import { scaleTime } from 'd3-scale'
import { select } from 'd3-selection'

import type { TimeBrushFooterProps } from './TimeBrush.types.js'
import { isoDay } from './format.js'
import { calculateBrush, wholeDateRangeSelected } from './utils.js'
import moment from 'moment'
import React, {
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

const DEFAULT_BAR_WIDTH = 8

export const TimeBrushFooter: React.FC<TimeBrushFooterProps> = memo(
	function TimeBrushFooter({
		dateRange,
		brushRange = null,
		width,
		height,
		barWidth = DEFAULT_BAR_WIDTH,
		onBrushEnd,
		roundToDay = false,
	}) {
		const theme = useThematic()
		const ref = useRef(null)
		const [plot, setPlot] = useState<any>()
		const [barGroup, setBarGroup] = useState<any>()

		const xScale = useMemo(
			() =>
				scaleTime()
					.domain(dateRange)
					.range([barWidth / 2, width - barWidth / 2]),
			[dateRange, width, barWidth],
		)

		const [internalBrushRange, setInternalBrushRange] = useState<
			[Date, Date] | null
		>(brushRange)

		const handleBrushEnd = useCallback(
			(event: any) => {
				let rng = calculateBrush(event, xScale, roundToDay)
				if (rng && wholeDateRangeSelected(rng, dateRange)) {
					// Clear the brush if the whole date range is selected
					rng = null
				}
				setInternalBrushRange(rng)
				if (onBrushEnd) {
					onBrushEnd(rng)
				}
			},
			[xScale, roundToDay, onBrushEnd, dateRange],
		)

		const handleBrushMove = useCallback(
			(event: any) => {
				const range = calculateBrush(event, xScale, roundToDay)
				setInternalBrushRange(range)
			},
			[xScale, roundToDay],
		)

		const brush = useMemo(
			() => brushX().on('end', handleBrushEnd).on('brush', handleBrushMove),
			[handleBrushEnd, handleBrushMove],
		)

		const data = useMemo(() => {
			if (dateRange) {
				const start = moment.utc(dateRange[0])
				const stop = moment.utc(dateRange[1])
				const delta = stop.diff(start, 'days')
				return [
					start.toDate(),
					...new Array(delta).fill(1).map((d, i) => {
						return start.add(d, 'day').toDate()
					}),
				]
			}
			return []
		}, [dateRange])

		useLayoutEffect(() => {
			select(ref.current).select('svg').remove()
			const g = select(ref.current)
				.append('svg')
				.attr('class', 'BottomTimeBrush-chart')
				.attr('width', width)
				.attr('height', height)
				.call(svg as any, theme.chart())
				.append('g')
				.attr('class', 'BottomTimeBrush-plotarea')
			const bg = g.append('g').attr('class', 'BottomTimeBrush-bars')
			setPlot(g)
			setBarGroup(bg)
		}, [theme, data, width, height])

		useLayoutEffect(() => {
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
		}, [theme, data, barGroup, width, height, barWidth, xScale])

		useLayoutEffect(() => {
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
		}, [theme, data, plot, height, width, dateRange])

		useLayoutEffect(() => {
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
		}, [theme, data, plot, height, width, xScale, internalBrushRange])

		useLayoutEffect(() => {
			// only actually append the brush interaction if there is an event to handle it
			// otherwise it is just an axis
			if (plot && onBrushEnd) {
				plot.append('g').attr('class', 'brush').call(brush)
			}
		}, [plot, brush, onBrushEnd])

		useLayoutEffect(
			function loadBrushRange() {
				setInternalBrushRange(brushRange)
				if (brushRange) {
					const [start, end] = brushRange
					const sx = xScale(start)
					const ex = xScale(end)
					brush.move(select('.brush'), [sx, ex] as any)
				} else {
					// Clear out brush when date range is maxed out.
					brush.move(select('.brush'), null)
				}
			},
			[setInternalBrushRange, brushRange, xScale, brush],
		)

		// force width of container to exactly match the svg
		const divStyle = useMemo(
			() => ({
				width,
				height,
				display: 'flex',
				flexDirection: 'column',
			}),
			[width, height],
		)
		return <div ref={ref} style={divStyle as React.CSSProperties} />
	},
)
