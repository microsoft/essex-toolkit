/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Palette } from '../types.js'
import { BooleanOperation } from '../types.js'

export const DEFAULT_PALETTE: Palette = {
	backgroundColor: 'white',
	operations: {
		[BooleanOperation.AND]: '#80acf7',
		[BooleanOperation.OR]: '#4D7BBA',
	},
}

export const NO_OP = (): void => {
	/* nothing */
}
