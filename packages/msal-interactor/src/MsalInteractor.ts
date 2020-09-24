/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	UserAgentApplication,
	AuthResponse,
	InteractionRequiredAuthError,
	Configuration,
} from 'msal'

export class MsalInteractor {
	private _instance: UserAgentApplication | undefined

	public constructor(
		private msalConfig: Configuration,
		private scopes: string[],
		private authDisabled = false,
	) {}

	/**
	 * Gets the MSAL Instance
	 */
	public get instance(): UserAgentApplication {
		if (this._instance != null) {
			return this._instance
		}

		const result = new UserAgentApplication(this.msalConfig)
		if (result != null) {
			result.handleRedirectCallback((err, res) => {
				console.log('MSAL handling redirect callback', err, res)
			})
		}
		this._instance = result
		return result
	}

	/**
	 * Performs a user login
	 */
	public async login(): Promise<AuthResponse | undefined> {
		if (this.authDisabled || this.suppressTokenRequest()) {
			return Promise.resolve(undefined)
		}
		console.log('logging in, requesting scopes', this.scopes)
		const scopes = this.scopes
		const authority = this.msalConfig.auth.authority
		const response = await this.instance.loginPopup({ scopes, authority })
		return response
	}

	/**
	 * Performs a user logout
	 */
	public async logout(): Promise<void> {
		if (this.authDisabled) {
			return Promise.resolve()
		}
		await this.instance.logout()
	}

	/**
	 * Acquires a token for the user
	 */
	public async getToken(): Promise<string> {
		if (this.authDisabled || this.suppressTokenRequest()) {
			return ''
		}
		const instance = this.instance
		const scopes = this.scopes
		if (instance.getAccount()) {
			const tokenRequest = { scopes }
			return instance
				.acquireTokenSilent(tokenRequest)
				.then(response => response.accessToken)
				.catch(err => {
					if (err.name instanceof InteractionRequiredAuthError) {
						return instance
							.acquireTokenPopup(tokenRequest)
							.then(response => response.accessToken)
							.catch(err => {
								throw err
							})
					} else {
						console.error('uncaught acquireSilent error', err)
						throw err
					}
				})
		} else {
			throw new Error('login required')
		}
	}

	private suppressTokenRequest(): boolean {
		/**
		 * If you would like to suppress this error, do not call acquireTokenSilent on page load when there is hash in the url and your app is inside an iframe."
		 * https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/1194#issuecomment-572750166
		 */
		const locationHasHash = Boolean(window.location.hash)
		const isInIframe =
			// eslint-disable-next-line no-restricted-globals
			typeof self !== 'undefined' && typeof top !== 'undefined' && self !== top
		return locationHasHash && isInIframe
	}
}
