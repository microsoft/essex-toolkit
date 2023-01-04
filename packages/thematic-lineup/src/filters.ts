/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { nameToLabel } from './lineup.js'

type LineUp = any
/**
 * Type of filter to apply.
 * TODO: round out the other data types supported by LineUp.
 */
export enum FilterType {
	Text,
	Number,
}

/**
 * Filter operation to apply.
 * TODO: complete the impls.
 */
export enum FilterOperation {
	None = 'None',
	Equal = 'Equal',
	NotEqual = 'NotEqual',
	GreaterThan = 'GreaterThan',
	LessThan = 'LessThan',
	GreaterThanOrEqual = 'GreaterThanOrEqual',
	LessThanOrEqual = 'LessThanOrEqual',
	Contains = 'Contains',
	DoesNotContain = 'DoesNotContain',
}

interface FilterText {
	filter: RegExp | string | number
	filterMissing: boolean
}
interface FindSortCriteria {
	asc: any
	col: any
}

/**
 * Filter definition.
 */
export interface Filter {
	/**
	 * What property (which translates to a column) to filter.
	 */
	propertyName: string
	/**
	 * The value to filter with.
	 */
	value: string | number
	type: FilterType
	operation: FilterOperation
}

const filterText = (
	filterDefinition: Filter,
	filterInstance: any,
): FilterText | null => {
	const { value, operation } = filterDefinition
	const filterMissing = value !== ''
	switch (operation) {
		case FilterOperation.None:
			return null
		case FilterOperation.DoesNotContain:
			return {
				filter: new RegExp(`^((?!${value}).)*$`),
				filterMissing,
			}
		case FilterOperation.Contains:
			return { filter: value, filterMissing }
		default:
			throw new Error(
				`Filter operation ${operation} not supported yet. Please implement!`,
			)
	}
}

const filterNumber = (filterDefinition: Filter, filterInstance: any): any => {
	const { value, operation } = filterDefinition
	switch (operation) {
		case FilterOperation.None:
			return null
		case FilterOperation.GreaterThanOrEqual:
			filterInstance.min = value
			return filterInstance
		default:
			throw new Error(
				`Filter operation ${operation} not supported yet. Please implement!`,
			)
	}
}

// this is a nasty way to find the last primary sort column used by lineup
// note that there may be multiple rankings for compound sorting, this will just give us the first
// also note the cast required, because rankings is a private property
// TODO: steeltoe this
const findSort = (lineup: LineUp): FindSortCriteria => {
	const l = lineup
	const sortCriteria =
		l.data.rankings &&
		l.data.rankings.length > 0 &&
		l.data.rankings[0] &&
		l.data.rankings[0].sortCriteria &&
		l.data.rankings[0].sortCriteria.length > 0 &&
		l.data.rankings[0].sortCriteria[0]
	const asc = sortCriteria?.asc
	const col = sortCriteria?.col.desc.column
	return { asc, col }
}

/**
 *  find a lineup column using the label, because the id name is not copied to the final desc
 * @param lineup - the lineup instance
 * @param name - the column name
 */
export const findColumn = (lineup: LineUp, name: string): any | undefined => {
	const label = nameToLabel(name)
	return lineup.data.find((d: any) => d.desc.label === label)
}

/**
 * Apply a list of Filters to a LineUp instance.
 * @param lineup - the lineup instance
 * @param filters - the filter array
 */
export const applyFilters = (lineup: LineUp, filters: Filter[]): void => {
	filters.forEach((flt) => {
		const { propertyName, type } = flt
		const column = lineup && findColumn(lineup, propertyName)
		if (column) {
			let filter = { ...column.getFilter() }
			switch (type) {
				case FilterType.Number:
					filter = filterNumber(flt, filter)
					break
				case FilterType.Text:
				default:
					filter = filterText(flt, filter)
					break
			}
			// get the previous sort column before we set the filter
			// this is due to a bug in lineup that forces us to sort by the filtered column
			// in order for the filter to apply (only a problem with Set columns)
			// note that this also forces us to apply a single sort, potentially disrupting compound sorting
			const { col, asc } = findSort(lineup)
			column.setFilter(filter)
			if (column.desc.type === 'set') {
				column.toggleMySorting()
				const prev = lineup && findColumn(lineup, col)
				prev?.sortByMe(asc)
			}
		}
	})
}
