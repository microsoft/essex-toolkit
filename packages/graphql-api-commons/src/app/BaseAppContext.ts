/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IAuthenticator } from '../authentication'
import { IBaseConfiguration } from '../configuration'

export interface IBuiltAppContext<
	Configuration extends IBaseConfiguration,
	Authenticator extends IAuthenticator<unknown, unknown>,
> {
	configuration: Configuration
	components: {
		authenticator: Authenticator
	}
}

export interface IRequestAppContext<
	Configuration extends IBaseConfiguration,
	Authenticator extends IAuthenticator<unknown, Identity>,
	Identity,
> extends IBuiltAppContext<Configuration, Authenticator> {
	request: {
		identity: Identity
	}
}
