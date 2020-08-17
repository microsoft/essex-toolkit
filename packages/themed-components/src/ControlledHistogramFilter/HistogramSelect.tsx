/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { chart, axis, rect as rectRenderer } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { histogram, max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { brushX } from 'd3-brush'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { select, event, Selection } from 'd3-selection'
import * as React from 'react'
import { useRef, useEffect, useMemo } from 'react'

const DEFAULT_MARGINS = {
	top: 8,
	right: 8,
	bottom: 20,
	left: 40,
}

export interface HistogramProps {
	width: number
	height: number
	data: number[]
	numberOfBins: number
	selectedRange: [number | undefined, number | undefined]
	onRangeChanged?: (range: [number | undefined, number | undefined]) => any
	selectedFill?: string
	unselectedFill?: string
	margins?: {
		top?: number
		right?: number
		bottom?: number
		left?: number
	}
}

interface ChartElements {
	svg: Selection<SVGSVGElement, unknown, null, undefined>
	viewPort: Selection<SVGGElement, unknown, null, undefined>
	plotArea: Selection<SVGGElement, unknown, null, undefined>
	xScale: ScaleLinear<number, number>
	reverseXScale: ScaleLinear<number, number>
	yScale: ScaleLinear<number, number>
	xAxis: Selection<SVGGElement, unknown, null, undefined>
	yAxis: Selection<SVGGElement, unknown, null, undefined>
	brush?: any
	brushGroup?: any
	brushSelection?: any
	domain: [number, number]
	vpWidth: number
	vpHeight: number
	onBrushEnd?: () => void
	updateNumberOfBins?: (n: number) => void
}
/**
 * HistogramSelect displays a D3 SVG histogram that contains
 * a D3 brush
 */
export const HistogramSelect = ({
	width,
	height,
	data,
	numberOfBins,
	selectedRange,
	onRangeChanged,
	selectedFill,
	unselectedFill,
	margins,
}: HistogramProps): JSX.Element => {
	const theme = useThematic()
	const minDataValue = useMemo(() => Math.min(...data), [data])
	const maxDataValue = useMemo(() => Math.max(...data), [data])
	const svgElementRef = useRef<SVGSVGElement>(null)
	const chartElements = useRef<ChartElements>()

	const correctedMargins = {
		...DEFAULT_MARGINS,
		...margins,
	}
	// define all chart elements and store in a ref for later access
	useEffect(() => {
		const element = svgElementRef.current
		if (element) {
			const svg = select(element)
			const viewPort = svg.append('g')
			const plotArea = viewPort.append('g').append('rect')
			const xScale = scaleLinear()
			const reverseXScale = scaleLinear()
			const xAxis = viewPort.append('g')
			const yScale = scaleLinear()
			const yAxis = viewPort.append('g')
			chartElements.current = {
				svg,
				viewPort,
				plotArea,
				xScale,
				reverseXScale,
				yScale,
				xAxis,
				yAxis,
				domain: [0, 0],
				vpWidth: 0,
				vpHeight: 0,
			} as any
		}
	}, [svgElementRef])

	// define the brush end call back
	useEffect(() => {
		const outerElements = chartElements.current
		if (outerElements) {
			outerElements.onBrushEnd = () => {
				const elements = chartElements.current
				if (elements) {
					const brushSelection = elements.brushSelection

					let newBrushSelection = event.selection
					if (newBrushSelection) {
						newBrushSelection = newBrushSelection.map(elements.reverseXScale)
						if (
							!brushSelection ||
							newBrushSelection[0] !== brushSelection[0] ||
							newBrushSelection[1] !== brushSelection[1]
						) {
							// set a new brush selection when the selection has changed
							elements.brushSelection = newBrushSelection
							if (onRangeChanged) {
								const newRange = [newBrushSelection[0], newBrushSelection[1]]
								if (newRange[0] === minDataValue) {
									newRange[0] = undefined
								}
								if (newRange[1] === maxDataValue) {
									newRange[1] = undefined
								}
								onRangeChanged(newRange as [number, number])
							}
						}
					} else if (brushSelection) {
						// clear the brush
						elements.brushSelection = undefined
						if (onRangeChanged) {
							onRangeChanged([undefined, undefined])
						}
					}
				}
			}
		}
	}, [chartElements, onRangeChanged, minDataValue, maxDataValue])

	// adjust chart elemnts for changes in data, width, and height
	// TODO the brush currently gets deleted and recreated on width / height changes
	// so it jumps to the new position instead of animating smoothly.  It'd be nice to fix but leaving it for now
	useEffect(() => {
		const elements = chartElements.current
		if (elements) {
			const {
				svg,
				viewPort,
				plotArea,
				xScale,
				reverseXScale,
				xAxis,
				yScale,
			} = elements

			const domain: [number, number] = [Math.min(...data), Math.max(...data)]
			elements.domain = domain

			const vpWidth = width - correctedMargins.left - correctedMargins.right
			const vpHeight = height - correctedMargins.top - correctedMargins.bottom
			elements.vpWidth = vpWidth
			elements.vpHeight = vpHeight

			// top level svg
			svg.call(chart as any, theme, { width, height })
			viewPort.attr(
				'transform',
				`translate(${correctedMargins.left},${correctedMargins.top})`,
			)

			plotArea
				.attr('width', vpWidth)
				.attr('height', vpHeight)
				.call(rectRenderer as any, theme.plotArea())

			// update scales and axis
			xScale.domain(domain).range([0, vpWidth])
			reverseXScale.domain([0, vpWidth]).range(domain)
			xAxis.call(axis as any, theme, axisBottom(xScale), {
				attr: {
					transform: `translate(0, ${vpHeight})`,
				},
			})
			yScale.range([vpHeight, 0])
		}
	}, [
		chartElements,
		width,
		height,
		data,
		selectedRange,
		theme,
		correctedMargins.left,
		correctedMargins.right,
		correctedMargins.top,
		correctedMargins.bottom,
	])

	// draw or update bars
	useEffect(() => {
		if (!data.length) {
			return
		}
		const elements = chartElements.current
		if (elements && numberOfBins) {
			// remove the old brush
			elements.viewPort.selectAll('.brush').remove()

			// define new bins
			const histo = histogram().domain(elements.domain).thresholds(numberOfBins)

			const bins = histo(data)

			elements.yScale.domain([
				0,
				max(bins, (d: number[]) => d.length) as number,
			]) // d3.hist has to be called before the Y axis obviously
			elements.yAxis.call(axis as any, theme, axisLeft(elements.yScale))

			// Join the rect with the bins data
			const u = elements.viewPort.selectAll('.bars').data(bins)

			// update the rects
			u.enter()
				.append('rect') // Add a new rect for each new elements
				.attr('class', 'bars')
				.merge(u as any) // get the already existing elements as well
				.attr('x', 1)
				.attr(
					'transform',
					d =>
						'translate(' +
						elements.xScale(d.x0 as number) +
						',' +
						elements.yScale(d.length) +
						')',
				)
				.attr('width', d =>
					Math.max(
						0,
						elements.xScale(d.x1 as number) -
							elements.xScale(d.x0 as number) -
							1,
					),
				)
				.attr('height', d => elements.vpHeight - elements.yScale(d.length))
				.style('fill', d => {
					const selectionStart =
						selectedRange[0] !== undefined ? selectedRange[0] : minDataValue
					const selectionEnd =
						selectedRange[1] !== undefined ? selectedRange[1] : maxDataValue
					if (
						d.x0 !== undefined &&
						d.x1 !== undefined &&
						d.x0 <= selectionEnd &&
						d.x1 >= selectionStart
					) {
						return (
							selectedFill ||
							theme.rect({ selectionState: SelectionState.Normal }).fill().hex()
						)
					} else {
						return (
							unselectedFill ||
							theme
								.rect({ selectionState: SelectionState.Suppressed })
								.fill()
								.hex()
						)
					}
				})

			u.exit().remove()
		}
	}, [
		numberOfBins,
		width,
		height,
		data,
		selectedFill,
		unselectedFill,
		selectedRange,
		minDataValue,
		maxDataValue,
		theme,
	])

	// handle brushing / selected range
	useEffect(() => {
		const elements = chartElements.current
		if (elements) {
			// remove the old brush
			elements.viewPort.selectAll('.brush').remove()
			elements.brushGroup = null

			const brush = brushX()
			brush.extent([
				[0, correctedMargins.top],
				[elements.vpWidth, elements.vpHeight + correctedMargins.bottom],
			])

			elements.brushGroup = elements.viewPort
				.append('g')
				.attr('class', 'brush')
				.call(brush)

			// adjust the new brush to the previous selection
			if (selectedRange[0] || selectedRange[1]) {
				const start = selectedRange[0] ? selectedRange[0] : minDataValue
				const end = selectedRange[1] ? selectedRange[1] : maxDataValue
				brush.move(
					elements.brushGroup,
					[start, end].map(elements.xScale) as any,
				)
			}

			// IMPORTANT, the brush end call back is not set until after the brush is moved
			if (elements.onBrushEnd) {
				brush.on('end', elements.onBrushEnd)
			}
		}
	}, [
		numberOfBins,
		width,
		height,
		data,
		selectedRange,
		minDataValue,
		maxDataValue,
		theme,
		correctedMargins.top,
		correctedMargins.bottom,
	])

	return <svg ref={svgElementRef} />
}
