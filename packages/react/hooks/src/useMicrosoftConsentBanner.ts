/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useState } from 'react'

declare const WcpConsent: any

export interface ConsentOptions {
	/**
	 * Default: 'dark'
	 */
	theme?: string
	/**
	 * default: 'cookie-consent'
	 */
	elementId?: string

	onChange?: (c: Consent) => void
}

export interface Consent {
	Required: boolean
	Advertising: boolean
	Analytics: boolean
	SocialMedia: boolean
}
const DEFAULT_CONSENT: Consent = {
	Required: true,
	Advertising: false,
	Analytics: false,
	SocialMedia: false,
}
const NOOP = () => {
	/*nothing */
}
interface ConsentUtil {
	manageConsent: () => void
	getConsent: () => Consent
}

const DEFAULT_CONSENT_OPTIONS: ConsentOptions = Object.freeze({})

/**
 * Uses the Microsoft cookie consent banner. The banner code should be loaded from CDN using a script tag.
 * <script src="https://wcpstatic.microsoft.com/mscc/lib/v2/wcp-consent.js"></script>
 * You should also include a div for the cookie banner to render into: e.g. <div id="cookie-banner" />
 * @param options The consent banner options. (optional)
 * 		options.theme; "light" | "dark", default "dark")
 * 		options.elementId; default = "cookie-banner"
 * 		options.onChange; (consent: Consent) => void; default=noop
 * @returns [current consent; manageConsent function (to be used in footer)]
 */
export function useMicrosoftConsentBanner({
	theme = 'dark',
	elementId = 'cookie-banner',
	onChange = NOOP,
}: ConsentOptions = DEFAULT_CONSENT_OPTIONS): [Consent, () => void] {
	const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT)
	const [consentUtil, setConsentUtil] = useState<ConsentUtil>({
		getConsent: () => DEFAULT_CONSENT,
		manageConsent: NOOP,
	})

	useEffect(
		() => {
			try {
				const element = document.getElementById(elementId)
				if (!element) {
					throw new Error(
						`Could not find element with id ${elementId}. You should include an element in your HTML for the cookie-banner to render into, e.g. 
						
					<body>
						...
						<div id="${elementId}" />
					</body>`,
					)
				}
				if (!WcpConsent) {
					throw new Error(`WcpConsent banner not initialized. You should include the WCP Consent script in your HTML header. e.g.

				<head>
					...
					<script src="https://wcpstatic.microsoft.com/mscc/lib/v2/wcp-consent.js"></script>
				</head>
				`)
				}
				WcpConsent.init(
					navigator.language,
					element,
					function initializeConsentManagement(
						err: Error,
						consentUtil: ConsentUtil,
					) {
						if (err) {
							console.error('error initalizing WcpConsent', err)
						} else {
							setConsentUtil(consentUtil)
						}
					},
					function onConsentChanged(consent: Consent) {
						setConsent(consent)
						onChange(consent)
					},
					theme,
				)
			} catch (err) {
				console.error('error initalizing consent', err)
			}
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[theme],
	)

	const manageConsent = useCallback(
		() => consentUtil.manageConsent(),
		[consentUtil],
	)

	return [consent, manageConsent]
}
