/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ReactNode } from 'react'

export enum BooleanOperation {
	AND = 'and',
	OR = 'or',
}

export interface BooleanOperationMap {
	__global__: BooleanOperation
	[key: string]: BooleanOperation
}

export interface Palette {
	backgroundColor: string
	operations: {
		[BooleanOperation.AND]: string
		[BooleanOperation.OR]: string
	}
}

export interface FilterClause {
	id: string
	label: string
}

export interface FilterClauseGroup {
	id: string
	label: string
	filters: FilterClause[]
	operation: BooleanOperation
	locked?: boolean
}

export interface WithChildren {
	children?: ReactNode
}
