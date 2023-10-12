/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface GroupedTerm {
	term: string
	date: Date
	count: number
}

export interface TimeBrushProps {
	elements: GroupedTerm[]
	dateRange: [Date, Date]
	width?: number
	height?: number
	chartWidth?: number
	selectionRange?: [Date, Date]
	markedDate?: Date
	from?: string 
	to?: string
	onChange: (from: string, to: string) => void
}

export interface TermBarProps {
	terms: GroupedTerm[]
	width: number
	height: number
	barWidth?: number
	dateExtent?: [Date, Date]
	selectionExtent?: [Date, Date]
	markedDate?: Date
}

export interface SparkbarProps {
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

export interface TimeBrushFooterProps {
	/**
	 * Date range that the time brush should cover
	 */
	dateRange: [Date, Date]
	/**
	 * Selected brush range
	 */
	brushRange?: [Date, Date]
	/**
	 * Width of the chart in pixels
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

	onBrushEnd?: (range: [Date, Date] | null) => void
	/**
	 * Round the brushing to full days
	 * (note, a more sophisticated impl could specify a round unit like 'day', 'hour')
	 */
	roundToDay?: boolean
}
