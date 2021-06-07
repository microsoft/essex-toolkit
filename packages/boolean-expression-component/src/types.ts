/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum BooleanOperation {
	AND = 'and',
	OR = 'or',
}

export interface BooleanOperationMap {
	__global__: BooleanOperation
	[key: string]: BooleanOperation
}

export interface Palette {
	operations: {
		[BooleanOperation.AND]: string
		[BooleanOperation.OR]: string
	}
}

export interface FilterClause {
	id: string
	attribute: number
	value: string
}

export interface FilterClauseGroup {
	id: string
	attributeId: number
	name: string
	filters: FilterClause[]
	operation: BooleanOperation
	locked: boolean
}
