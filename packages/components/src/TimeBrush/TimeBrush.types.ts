/**
 * Serialized ISO date string for start/end date of a range
 */
export type ISODateRange = [string, string]

export interface TimeBrushProps {
	search: string
	width?: number
	height?: number
	barWidth?: number
	dateRange?: [Date, Date]
	selectionRange?: [Date, Date]
	markedDate?: Date
}

export interface DailyTerm {
	term: string
	date: Date
	count: number
}

export interface TimeBrushItem {
	key: string
	text?: string
}