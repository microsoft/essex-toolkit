/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BooleanOperation } from './types'

export function toggleOperation(op: BooleanOperation): BooleanOperation {
	return op === BooleanOperation.AND
		? BooleanOperation.OR
		: BooleanOperation.AND
}

export const booleanOperationColors: Record<BooleanOperation, string> = {
	[BooleanOperation.AND]: '#80acf7',
	[BooleanOperation.OR]: '#4D7BBA',
}
