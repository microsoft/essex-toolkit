/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TermBar } from './TermBar.js'
import type { TimeBrushProps } from './TimeBrush.types.js'
import { TimeBrushFooter } from './TimeBrushFooter.js'
import moment from 'moment'
import { memo, useCallback, useMemo } from 'react'

const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 24
const DEFAULT_BAR_WIDTH = 4
const BAR_GAP = 1

export const TimeBrush: React.FC<TimeBrushProps> = memo(function TimeBrush({
	width = DEFAULT_WIDTH,
	height = DEFAULT_HEIGHT,
	dateRange,
	markedDate,
	elements,
	from,
	to,
	onChange,
}) {
	const barWidth = useMemo(() => {
		if (dateRange && width) {
			const start = moment.utc(dateRange[0])
			const stop = moment.utc(dateRange[1])
			const delta = stop.diff(start, 'days')
			return (width - delta * BAR_GAP) / delta
		}
		return DEFAULT_BAR_WIDTH
	}, [dateRange, width])

	const handleBrushEnd = useCallback(
		(range: [Date, Date] | null) => {
			onChange(range?.[0]?.toISOString() ?? '', range?.[1]?.toISOString() ?? '')
		},
		[onChange],
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
