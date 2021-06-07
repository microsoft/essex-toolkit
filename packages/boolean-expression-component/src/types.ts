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
