/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { rect, line, svg } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import React, {
	memo,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	useMemo,
} from 'react'

interface SparkbarProps {
	/**
	 * Array of data to plot as bars
	 */
	data: unknown[]
	/**
	 * Width of the chart in pixels
	 * Note that there is no validation that the number of bars at specified width will fit
	 */
	width: number
	/**
	 * Height of the chart in pixels
	 */
	height: number
	/**
	 * Width of each bar on the chart
	 */
	barWidth?: number
	/**
	 * Gap between bars on the chart
	 */
	barGap?: number
	/**
	 * Accessor function that accepts a datum and returns an id string
	 */
	id: (d: unknown) => string
	/**
	 * Accessor function that accepts a datum and returns the plottable value
	 */
	value: (d: unknown) => number
	/**
	 * Accessor function that accepts a datum and returns whether it is a no data placeholder
	 */
	nodata?: (d: unknown) => boolean
	/**
	 * Selected datum to highlight on the chart
	 */
	selected?: (d: unknown) => boolean
	/**
	 * Click handler for datum bars
	 */
	onClick?: (d: unknown) => void
	/**
	 * Scale for x position
	 */
	xScale?: (d: unknown, i: number) => number
	/**
	 * Special indicator for a data point to highlight above and beyond normal selection.
	 */
	marked?: (d: unknown) => boolean
}

export const Sparkbar: React.FC<SparkbarProps> = memo(function Sparkbar({
	data,
	width,
	height,
	barWidth = 8,
	barGap = 1,
	id,
	value,
	nodata,
	selected,
	onClick,
	xScale,
	marked,
}) {
	const theme = useThematic()
	const ref = useRef(null)
	const handleClick = useCallback(
		d => {
			if (onClick) {
				onClick(d)
			}
		},
		[onClick],
	)
	const nodataFn = useCallback(
		(d: unknown) => {
			if (nodata) {
				return nodata(d)
			}
			return false
		},
		[nodata],
	)
	const [hovered, setHovered] = useState<any>(null)
	const handleHover = useCallback(d => setHovered(d), [])
	const [barGroup, setBarGroup] = useState<any>()

	useLayoutEffect(() => {
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
		const bg = g.append('g').attr('class', 'sparkbar-bars')
		setBarGroup(bg)
	}, [theme, data, width, height])

	useLayoutEffect(() => {
		if (data.length > 0) {
			const ext = data.reduce<[number, number]>(
				(acc, cur) => {
					if (!nodataFn(cur)) {
						const val = value(cur)
						return [Math.min(acc[0], val), Math.max(acc[1], val)]
					}
					return acc
				},
				[Number.MAX_VALUE, Number.MIN_VALUE],
			)
			const hScale = scaleLinear().domain(ext).range([0, height])
			const x = xScale ? xScale : (d, i) => i * (barWidth + barGap)
			const h = d => (nodataFn(d) ? height : hScale(value(d)))
			const y = d => height - (h(d) || 0)

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
	}, [
		theme,
		data,
		barGroup,
		width,
		height,
		barWidth,
		barGap,
		value,
		nodataFn,
		xScale,
	])

	useLayoutEffect(() => {
		if (barGroup) {
			barGroup
				.selectAll('.bar')
				.on('mouseover', d => handleHover(d))
				.on('mouseout', () => handleHover(null))
				.on('click', handleClick)
		}
	}, [data, barGroup, id, handleClick, handleHover])

	useLayoutEffect(() => {
		const cursor = onClick ? 'pointer' : 'default'
		if (barGroup) {
			barGroup.selectAll('.bar').style('cursor', cursor)
		}
	}, [data, barGroup, onClick])

	// generate a complimentary highlight
	const highlight = useMemo(() => theme.scales().nominal(10)(1).hex(), [theme])

	useLayoutEffect(() => {
		const getSelectionState = d => {
			if (nodataFn(d)) {
				return SelectionState.NoData
			}
			if (d === hovered) {
				return SelectionState.Hovered
			}
			const sel = selected ? selected(d) : false
			if (sel) {
				return SelectionState.Selected
			}
			return SelectionState.Normal
		}
		if (barGroup) {
			barGroup.selectAll('.bar').attr('stroke', d => {
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
	}, [
		theme,
		data,
		barGroup,
		highlight,
		nodataFn,
		id,
		hovered,
		selected,
		marked,
	])

	// force width of container to exactly match the svg
	const divStyle = useMemo(() => ({ width, height }), [width, height])

	return <div ref={ref} style={divStyle} />
})