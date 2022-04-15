/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AccountInfo, IPublicClientApplication } from '@azure/msal-browser'
import debug from 'debug'

const log = debug('essex:msal-interactor')

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
			log('error in acquireTokenSilent', err)
			return instance
				.acquireTokenPopup({ scopes })
				.then(res => res.accessToken)
				.catch(err => {
					log('error in acquireTokenPopup', err)
					throw err
				})
		})
}
