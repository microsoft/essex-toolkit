/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * A interface describing a hashmap
 */
export interface HashMap<Value = any> {
	[key: string]: Value
	[key: number]: Value
}
