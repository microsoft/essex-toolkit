/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from './SparkBar.js'
import type { TermBarProps } from './TimeBrush.types.js'
import { scaleTime } from 'd3-scale'
import moment from 'moment'
import { memo, useCallback, useMemo } from 'react'

const DEFAULT_BAR_WIDTH = 4

export const TermBar: React.FC<TermBarProps> = memo(function TermBar({
	terms,
	width,
	height,
	barWidth = DEFAULT_BAR_WIDTH,
	dateExtent,
	selectionExtent,
	markedDate,
}) {
	const id = useCallback((d: any) => `${d.term}-${d.date}`, [])
	const accessor = useCallback((d: any) => d.count, [])
	const selected = useCallback(
		(d: any) => {
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
	const md = useMemo(
		() => (markedDate ? moment.utc(markedDate) : null),
		[markedDate],
	)
	const marked = useCallback((d: any) => !!md?.isSame(d.date, 'day'), [md])
	const nodata = useCallback((d: any) => d.count < 0, [])
	// use an extent if one is provided, otherwise compute from supplied values
	const domain = useMemo(() => {
		if (dateExtent) {
			return dateExtent
		}
		const moments = terms.map((t: any) => moment(t.date))
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

	const xScale = useMemo(() => (d: any, i: number) => time(d.date), [time])
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
