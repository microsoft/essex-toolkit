/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Common authenticator interface
 */
export interface IAuthenticator<Credentials, Identity> {
	/**
	 * Log into the system with some credentials
	 * @param credentials The credentials to provide
	 */
	login(credentials: Credentials): Promise<Identity | null>

	/**
	 * Log into the system with a JWT token
	 * @param token The token to use
	 */
	verifyToken(token: string | null): Promise<Identity | null>

	/**
	 * Log out of the system
	 */
	logout(): Promise<void>
}
