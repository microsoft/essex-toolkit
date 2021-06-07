/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BooleanOperation } from '../types'

export interface Filter {
	id: string
	attribute: number
	value: string
}

export interface FilterGroup {
	id: string
	attributeId: number
	name: string
	filters: Filter[]
	operation: BooleanOperation
	locked: boolean
}
