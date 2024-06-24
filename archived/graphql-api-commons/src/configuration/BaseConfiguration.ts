/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface IBaseConfiguration {
	/**
	 * The port the server will run on
	 */
	serverPort: number

	/**
	 * Whether or not to present the GraphQL Playground
	 */
	serverPlayground: boolean

	/**
	 * Whether to enable GraphQL introspection
	 */
	serverIntrospection: boolean

	/**
	 * Whether to prettify logger output
	 */
	loggingPretty: boolean
}
