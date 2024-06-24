/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { brushX } from 'd3-brush'
import { scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import moment from 'moment'
import {
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import type { TimeBrushFooterProps } from './TimeBrush.types.js'
import {
	calculateBrush,
	changePlot,
	createBarGroup,
	createPlot,
	selectAll,
	selectAllPlot,
	wholeDateRangeSelected,
} from './TimeBrushFooter.utils.js'

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
			const g = createPlot(ref, theme, width, height)
			setPlot(g)
			setBarGroup(createBarGroup(g))
		}, [theme, data, width, height])

		useLayoutEffect(() => {
			selectAll(data, barGroup, xScale, height, theme, SelectionState, barWidth)
		}, [theme, data, barGroup, width, height, barWidth, xScale])

		useLayoutEffect(() => {
			changePlot(plot, dateRange, height, theme, width)
		}, [theme, data, plot, height, width, dateRange])

		useLayoutEffect(() => {
			selectAllPlot(plot, internalBrushRange, xScale, theme)
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
