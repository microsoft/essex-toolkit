/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IBaseConfiguration } from '../configuration/index.js'

export interface IBuiltAppContext<
	Configuration extends IBaseConfiguration,
	Components,
> {
	configuration: Configuration
	components: Components
}

export interface IRequestAppContext<
	Configuration extends IBaseConfiguration,
	Components,
	RequestContext,
> extends IBuiltAppContext<Configuration, Components> {
	request: RequestContext
}
