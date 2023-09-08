/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { scaleTime } from 'd3-scale'
import moment from 'moment'
import React, { memo, useCallback, useMemo } from 'react'
import type { TermBarProps } from './TimeBrush.types.js'
import { Sparkbar } from './SparkBar.js'

export const TermBar: React.FC<TermBarProps> = memo(function TermBar({
	terms,
	width,
	height,
	barWidth = 4,
	dateExtent,
	selectionExtent,
	markedDate,
}) {
	const id = useCallback((d: { term: any; date: any }) => `${d.term}-${d.date}`, [])
	const accessor = useCallback((d: { count: any }) => d.count, [])
	const selected = useCallback(
		(		d: { date: number }) => {
			if (selectionExtent) {
				return (
					d.date.valueOf() >= selectionExtent[0].valueOf() &&
					d.date.valueOf() <= selectionExtent[1].valueOf()
				)
			}
			return false
		},
		[selectionExtent],
	)
	const md = useMemo(() => (markedDate ? moment.utc(markedDate) : null), [
		markedDate,
	])
	const marked = useCallback((d: { date: any }) => !!(md && md.isSame(d.date, 'day')), [md])
	const nodata = useCallback((d: { count: number }) => d.count < 0, [])
	// use an extent if one is provided, otherwise compute from supplied values
	const domain = useMemo(() => {
		if (dateExtent) {
			return dateExtent
		}
		const moments = terms.map(t => moment(t.date))
		const min = moment.min(moments)
		const max = moment.max(moments)
		return [min, max]
	}, [terms, dateExtent])
	const time = useMemo(
		() =>
			scaleTime()
				.domain(domain)
				.range([barWidth / 2, width - barWidth / 2]),
		[domain, width, barWidth],
	)
	const xScale = useMemo(() => (d: { date: any }, i: number) => time(d.date), [time])
	return (
		<Sparkbar
			data={terms}
			width={width}
			height={height}
			id={id}
			value={accessor}
			xScale={xScale as (input: unknown, i: number) => number}
			selected={selected}
			barWidth={barWidth}
			marked={marked}
			nodata={nodata}
		/>
	)
})
