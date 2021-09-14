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
	login(credentials: Credentials): Promise<Identity>

	/**
	 * Log iinto the system with a JWT token
	 * @param token The token to use
	 */
	verifyToken(token: string | null | undefined): Promise<Identity>

	/**
	 * Log out of the system
	 */
	logout(): Promise<void>
}
