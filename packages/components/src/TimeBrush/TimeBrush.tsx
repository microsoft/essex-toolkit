import { TermBar } from './TermBar.js'
import type { TimeBrushProps } from './TimeBrush.types.js'
import { TimeBrushFooter } from './TimeBrushFooter.js'
import moment from 'moment'
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useMemo, useState } from 'react'

const CHART_WIDTH = 800
const BAR_GAP = 1

export const TimeBrush: React.FC<TimeBrushProps> = memo(function TimeBrush({
	width = 800,
	height = 24,
	chartWidth = CHART_WIDTH,
	dateRange,
	markedDate,
	elements,
}) {
	const [from, setFrom] = useState<string>('from')
	const [to, setTo] = useState<string>('to')

	const barWidth = useMemo(() => {
		if (dateRange && chartWidth) {
			const start = moment.utc(dateRange[0])
			const stop = moment.utc(dateRange[1])
			const delta = stop.diff(start, 'days')
			return (chartWidth - delta * BAR_GAP) / delta
		}
		return 4
	}, [chartWidth, dateRange])

	const handleBrushEnd = useCallback(
		(range: [Date, Date] | null) => {
			setFrom(range?.[0]?.toISOString() ?? '')
			setTo(range?.[1]?.toISOString() ?? '')
		},
		[setFrom, setTo],
	)

	const selectionRange: [Date, Date] | undefined = useMemo(() => {
		if (from && to) {
			return [new Date(from), new Date(to)]
		}
	}, [from, to])

	return (
		<div>
			<TermBar
				terms={elements}
				width={width}
				height={height}
				barWidth={barWidth}
				dateExtent={dateRange}
				selectionExtent={selectionRange}
				markedDate={markedDate}
			/>
			<TimeBrushFooter
				dateRange={dateRange}
				brushRange={selectionRange}
				width={width}
				height={18}
				barWidth={barWidth}
				onBrushEnd={handleBrushEnd}
				roundToDay={true}
			/>
		</div>
	)
})
