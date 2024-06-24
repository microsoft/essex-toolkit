/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'

export function getSchema(resolvedPath: string): string {
	const result = fs.readFileSync(resolvedPath, {
		encoding: 'utf-8',
	})
	if (result.length === 0) {
		throw new Error('empty schema detected')
	}
	return result
}
