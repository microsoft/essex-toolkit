/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser'

/**
 * Retrieves an access token for the currently logged in user
 *
 * @throws when unable to fetch a token ia retry
 */
export function getAccessToken(
	instance: IPublicClientApplication,
	account: AccountInfo,
	scopes: string[],
): Promise<string> {
	return instance
		.acquireTokenSilent({
			scopes,
			account,
		})
		.then(res => res.accessToken)
		.catch(err => {
			console.error('error fetching api token', err)
			return instance
				.acquireTokenPopup({ scopes })
				.then(res => res.accessToken)
				.catch(err => {
					console.error('error fetching token', err)
					throw err
				})
		})
}
