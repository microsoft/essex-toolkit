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
