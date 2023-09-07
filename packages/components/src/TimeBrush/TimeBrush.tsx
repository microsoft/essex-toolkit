/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useState, useMemo } from 'react'
import { useDailyTermCounts } from './TimeBrush.hooks.js'
import { TermBar } from './TermBar.js'
import { TimeBrushFooter } from './TimeBrushFooter.js'
import { TimeBrushProps } from './TimeBrush.types.js'
import moment from 'moment'

const CHART_WIDTH = 800
const BAR_GAP = 1

export const TimeBrush: React.FC<TimeBrushProps> = memo(
	function TimeBrush({
		search,
		width = 800,
		height = 24,
		dateRange,
		markedDate,
	}) {
		const [terms] = useDailyTermCounts(search, dateRange)
		const [query, setQuery] = useState<string>('query')
		const [from, setFrom] = useState<string>('from')
		const [to, setTo] = useState<string>('to')

		const barWidth = useMemo(() => {
			if (dateRange && CHART_WIDTH) {
				const start = moment.utc(dateRange[0])
				const stop = moment.utc(dateRange[1])
				const delta = stop.diff(start, 'days')
				return (CHART_WIDTH - delta * BAR_GAP) / delta
			}
			return 4
		}, [CHART_WIDTH, dateRange])

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
					terms={terms}
					width={CHART_WIDTH}
					height={height}
					barWidth={barWidth}
					dateExtent={dateRange}
					selectionExtent={selectionRange}
					markedDate={markedDate}
				/>
				<TimeBrushFooter
					dateRange={dateRange}
					brushRange={selectionRange}
					width={CHART_WIDTH}
					height={18}
					barWidth={barWidth}
					onBrushEnd={handleBrushEnd}
					roundToDay={true}
				/>
			</div>
		)
	},
)
