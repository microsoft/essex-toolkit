/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Generic type referencing for all stories
 */
export type CSF<P = Record<string, any>> = React.FC<P> & {
	story?: {
		name: string
	}
}
