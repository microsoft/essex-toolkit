/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { histogram, interpolate } from '@essex-js-toolkit/toolbox'
import { chart, plotArea, line as lineRenderer } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import * as React from 'react'
import { useRef, useMemo, useEffect } from 'react'

const BINS = 10

interface ClippedGraphProps {
	/**
	 * List of values to plot. Currently this is the y axis, the x axis is ordinal.
	 * TODO: support more complex data types such as x/y points or explicit time series.
	 */
	data: number[]
	/**
	 * Width of the chart in pixels.
	 */
	width: number
	/**
	 * Height of the chart in pixels.
	 */
	height: number
	/**
	 * Indicates that the y axis should be clipped due to extreme values.
	 * 90th percentile will be plotted.
	 */
	clipped?: boolean
	/**
	 * Percentile of the data to plot on the main graph.
	 * The remainder will be plotted as overflow.
	 */
	percentile?: number
	/**
	 * Indicates if a gradient fill should be used under the line to add redundant data encoding.
	 */
	gradient?: boolean
	/**
	 * This is a multiplier to use for interpolating gradient values between data values.
	 * If your data is not very dense, the gradient fill will look very blocky.
	 * Defaults to 4.
	 */
	gradientInterpolation?: number
	/**
	 * Indicates if the gradient should just be a band along the top instead of filling under the line.
	 * If supplied, this should be a height for the band in pixels.
	 */
	gradientBand?: number
	/**
	 * Indicates to create a horizon plot instead, by 'wrapping' the top 10% data values around the y axis.
	 */
	horizon?: boolean
	/**
	 * Render this as a sparkline, i.e., much thinner and lighter.
	 */
	sparkline?: boolean
}

/**
 * Creates a line chart that handles extreme distributions with a few clipping/wrapping strategies.
 * The "clipped graph" concept was presented by Haihan Lin at VIS2019.
 * https://vdl.sci.utah.edu/publications/2019_infovis_clipped_graphs/
 * This chart can also produce a horizon plot, or be formatted to look like a sparkline.
 * For examples of these variants, see the visual sandbox:
 * https://visualsandbox.azurewebsites.net/#/experiments/clipped-graphs
 */
export const ClippedGraph = ({
	data,
	width,
	height,
	clipped,
	percentile = 90,
	gradient,
	gradientInterpolation = 4,
	gradientBand = 0,
	horizon,
	sparkline,
}: ClippedGraphProps): JSX.Element => {
	const theme = useThematic()
	const ref = useRef(null)
	const smoothed = useMemo(
		(): number[] => interpolate(data, gradientInterpolation),
		[data, gradientInterpolation],
	)
	const histo = useMemo(() => histogram(data, BINS, (d: any) => d, true), [
		data,
	])

	useEffect(() => {
		const len = histo.length
		const fullMax = histo[len - 1].x1
		const percBin = Math.round(percentile / 10) - 1
		const clippedMax = clipped ? histo[percBin].x1 : fullMax
		const sPer = width / smoothed.length
		const color = theme.scales().sequential([0, fullMax])
		const yScale = scaleLinear()
			.domain([0, clippedMax])
			.range([height, gradientBand])
		const xScale = scaleLinear()
			.domain([0, data.length - 1])
			.range([0, width])
		const sScale = scaleLinear()
			.domain([0, smoothed.length - 1])
			.range([0, width])

		const svg = select(ref.current)
		svg.selectAll('*').remove()

		svg.call(chart as any, theme, { width, height })
		const g = svg.append('g').call(plotArea as any, theme)

		// make the basic line path
		const line = data.reduce((acc, cur, idx) => {
			const x = xScale(idx)
			const y = yScale(cur)
			return acc + `L${x},${y}`
		}, '')

		// for the line chart itself, prepend a move to the first position
		const path = `M${0},${yScale(data[0])}` + line
		// for the clip path, instead we want to start and end at zeros for a complete fill
		const clip = `M${0},${height}` + line + `L${width},${height}`

		const clipId = `gradient-clip-${Math.random()}`
		svg
			.append('clipPath')
			.attr('id', `full-${clipId}`)
			.append('path')
			.attr('d', clip)
		svg
			.append('clipPath')
			.attr('id', `band-${clipId}`)
			.append('rect')
			.attr('width', width)
			.attr('height', gradientBand)

		svg
			.append('clipPath')
			.attr('id', `plot-${clipId}`)
			.append('rect')
			.attr('width', width)
			.attr('height', height - gradientBand)
			.attr('y', gradientBand)

		if (horizon) {
			const wrapCount = Math.ceil(Math.abs(yScale(fullMax)) / height)
			// create a second line for the clipped part to 'wrap'
			// this is just a transform to slide it down so it appears wrapped
			for (let w = 0; w <= wrapCount; w++) {
				g.append('g')
					.append('path')
					.attr('d', clip)
					.attr('transform', `translate(0,${height * w})`)
					.attr('fill', d => color(fullMax * (w / wrapCount)).hex())
					.attr('stroke', 'none')
				g.append('g')
					.append('path')
					.attr('d', path)
					.attr('transform', `translate(0,${height * w})`)
					.call(lineRenderer as any, theme.line())
					.attr('stroke', theme.application().accent().hex())
			}
		}

		if (gradient) {
			g.append('g')
				.attr(
					'clip-path',
					`url(#${gradientBand > 0 ? 'band' : 'full'}-${clipId})`,
				)
				.selectAll('.gradient')
				.data(smoothed)
				.enter()
				.append('rect')
				.attr('class', 'gradient')
				.attr('x', (d, i) => sScale(i) - sPer / 2)
				.attr('height', gradientBand || height)
				.attr('width', sPer)
				.attr('fill', (d: number) => color(d).hex())
				.attr('stroke', (d: number) => color(d).hex())
		}

		if (!horizon) {
			g.append('g')
				.attr('clip-path', `url(#plot-${clipId})`)
				.append('path')
				.attr('d', path)
				// TODO: add a sparkline element to thematic? or some form of permutation to regular marks to "miniaturize"
				.call(lineRenderer as any, sparkline ? theme.gridLines() : theme.line())
				.attr('stroke', theme.application().accent().hex())
		}
	}, [
		theme,
		smoothed,
		gradient,
		gradientInterpolation,
		gradientBand,
		horizon,
		histo,
		width,
		height,
		percentile,
		clipped,
		data,
		sparkline,
	])

	return <svg ref={ref} width={width} height={height} />
}
