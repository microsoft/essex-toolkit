/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AccountInfo,
	AuthenticationResult,
	Configuration,
	IPublicClientApplication,
} from '@azure/msal-browser'
import {
	InteractionRequiredAuthError,
	PublicClientApplication,
	SilentRequest,
} from '@azure/msal-browser'

export interface MsalInteractorOptions {
	msalConfig: Configuration
	oidcScopes: string[]
}

export interface MsalInteractorLoginOptions {
	usePopup?: boolean
}

export class MsalInteractor {
	private static _instance: MsalInteractor | null
	private static _options: MsalInteractorOptions | null
	private _msalConfig: Configuration
	private _oidcScopes: string[]
	private _msalInstance: IPublicClientApplication
	private _accountInfo: AccountInfo | null = null
	public isAuthenticated: () => Promise<boolean>

	/**
	 * Singleton. Use MsalInteractor.configure(options)
	 * and MsalInteractor.getInstance()
	 */
	private constructor({ msalConfig, oidcScopes }: MsalInteractorOptions) {
		this._msalConfig = msalConfig
		this._oidcScopes = oidcScopes
		this._msalInstance = new PublicClientApplication(this._msalConfig)

		// On page load/instantiation, check if responding to redirect auth flow
		const pageLoadHandler = this._msalInstance
			.handleRedirectPromise()
			.then(this._handleAuthResponse)

		this.isAuthenticated = () => pageLoadHandler.then(res => !!res)
	}

	public static configure = (options: MsalInteractorOptions): void => {
		MsalInteractor._options = options
	}

	public static getInstance = (): MsalInteractor => {
		if (MsalInteractor._instance) {
			return MsalInteractor._instance
		}

		if (!MsalInteractor._options) {
			throw new TypeError(
				`Cannot instantiate MsalInteractor without configuration options. Call configure() before getInstance()`,
			)
		}

		MsalInteractor._instance = new MsalInteractor(MsalInteractor._options)
		return MsalInteractor._instance
	}

	/**
	 * User login.
	 *
	 * Attempt to login silently with current valid session
	 * before logging in using either popUp or redirect flow.
	 */
	public login = async (
		options: MsalInteractorLoginOptions = {},
	): Promise<AuthenticationResult | null> => {
		const { usePopup = false } = options

		// try to login silently
		if (await this.isAuthenticated()) {
			const authResult = await this._getAuthResult()
			if (authResult) {
				return authResult
			}
		}

		if (usePopup) {
			const authResult = this._msalInstance
				.loginPopup({
					scopes: this._oidcScopes,
				})
				.then(this._handleAuthResponse)

			this.isAuthenticated = () => authResult.then(res => !!res)
			return authResult
		} else {
			return this._msalInstance
				.loginRedirect({ scopes: this._oidcScopes })
				.then(r => null)
		}
	}

	/**
	 * User logout
	 */
	public logout = async (): Promise<void> => {
		this.isAuthenticated = async () => false
		if (!this._accountInfo) {
			return
		}
		const logoutRequest = {
			account: this._accountInfo,
		}

		return this._msalInstance.logout(logoutRequest)
	}

	/**
	 * Get user ID claims.
	 */
	public getIdTokenClaims = async (): Promise<
		Record<string, string | number>
	> => {
		// Silently load auth session or prompt for login
		const authResult = await this.login({ usePopup: true })

		if (!authResult) {
			throw new Error(`Unable to load id token. User is not logged in`)
		}

		return authResult.idTokenClaims as Record<string, string | number>
	}

	/**
	 * Get access_token for a given set of scopes.
	 * Scopes must all be for the same domain/API.
	 * Cannot request an access token spanning APIs.
	 *
	 * Attempt to silently retrieve access token by
	 * checking token cache first. Fallback to
	 * interaction if silent call fails.
	 */
	public getAccessToken = async (scopes: string[]): Promise<string> => {
		// Silently load auth session or prompt for login.
		const authResult = await this.login({ usePopup: true })

		if (!authResult) {
			throw new Error(`Unable to load access token. User is not logged in.`)
		}

		const request: SilentRequest = {
			account: authResult.account,
			scopes,
		}

		return this._msalInstance
			.acquireTokenSilent(request)
			.then(res => res.accessToken)
			.catch(error => {
				if (error instanceof InteractionRequiredAuthError) {
					// Fallback to interaction when silent call fails
					return this._msalInstance
						.acquireTokenPopup(request)
						.then(res => res.accessToken)
				} else {
					throw error
				}
			})
	}

	/**
	 * Handle authentication response.
	 *
	 * Runs on page load for handling redirect auth flow
	 * and after popUp login flow.
	 */
	private _handleAuthResponse = async (
		response: AuthenticationResult | null,
	): Promise<AuthenticationResult | null> => {
		// response === null -> initial page load or refresh
		// not apart of a redirect auth flow.
		// response !== null -> either redirect auth flow
		// or popUp auth flow.
		if (response != null) {
			this._accountInfo = response.account
			return response
		}

		// Even on initial page load, or refresh, there may
		// be a valid user session from a previous login.
		this._selectAccount()
		const authResult = await this._getAuthResult()
		return authResult
	}

	/**
	 * On page load, try to load an active logged in account.
	 * If there is more than 1 logged in account than
	 * the user will need to go through an auth flow to
	 * manually select which account to use.
	 */
	private _selectAccount = () => {
		const currentAccounts = this._msalInstance.getAllAccounts()

		if (currentAccounts && currentAccounts.length === 1) {
			this._accountInfo = currentAccounts[0]
		}
	}

	/**
	 * Load valid auth session for the current logged in user
	 * Or return null.
	 */
	private _getAuthResult = async (): Promise<AuthenticationResult | null> => {
		if (this._accountInfo) {
			try {
				const authResult = await this._msalInstance.ssoSilent({
					scopes: this._oidcScopes,
					loginHint: this._accountInfo.username,
				})
				return authResult
			} catch (ex) {
				return null
			}
		}
		return null
	}
}
