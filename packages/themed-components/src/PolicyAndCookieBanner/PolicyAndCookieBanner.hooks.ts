/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'

import type {
	CookieConsent,
	CookieConsentBannerThemes,
	CookieConsentManager,
	WcpConsent as WC,
} from './PolicyAndCookieBanner.types.js'

declare global {
	interface Window {
		WcpConsent: WC | undefined
	}
}

const CHECK_FOR_LOADING_STATUS_EVERY_MS = 50

export type useLoadMSFTCookieScriptOptions = {
	language: string
	theme: CookieConsentBannerThemes
	onConsentChange: (newConsent: CookieConsent) => void
	onError: (error: unknown) => void
	maxScriptLoadingTimeMs?: number
	cookieConsentBannerId?: string
	cookieScriptSrc?: string
	cookieScriptTagId?: string
}
export function useLoadMSFTCookieScript({
	language,
	theme,
	onConsentChange,
	onError,
	maxScriptLoadingTimeMs = 5000,
	cookieScriptTagId = `msft-cookie-script`,
	cookieConsentBannerId = `msft-cookie-consent-banner`,
	cookieScriptSrc = 'https://wcpstatic.microsoft.com/mscc/lib/v2/wcp-consent.js',
}: useLoadMSFTCookieScriptOptions): CookieConsentManager | undefined {
	const [consentManager, setConsentManager] = useState<
		CookieConsentManager | undefined
	>()
	useEffect(() => {
		async function initialize(): Promise<void> {
			try {
				if (consentManager !== undefined) return

				if (!isCookieScriptLoaded(cookieScriptTagId)) {
					await addCookieScript({
						maxScriptLoadingTimeMs,
						cookieScriptSrc,
						cookieScriptTagId,
					})
				}
				if (!isCookieBannerPlaceholderElementPresent(cookieConsentBannerId)) {
					addCookieBannerPlaceholderElement(cookieConsentBannerId)
				}

				const cookieBannerPlaceholderElement = document.getElementById(
					cookieConsentBannerId,
				)!

				window.WcpConsent!.init(
					language,
					cookieBannerPlaceholderElement,
					function initializeConsentManager(err, consentManager) {
						if (err) {
							console.error(err)
							return
						}
						setConsentManager(consentManager)
					},
					onConsentChange,
					theme,
				)
			} catch (error) {
				onError(error)
			}
		}

		void initialize()
	}, [
		language,
		theme,
		onConsentChange,
		consentManager,
		setConsentManager,
		onError,
	])

	return consentManager
}

function isCookieScriptLoaded(cookieScriptTagId: string): boolean {
	return (
		!!document.getElementById(cookieScriptTagId) &&
		window.WcpConsent !== undefined
	)
}

async function addCookieScript({
	cookieScriptTagId,
	cookieScriptSrc,
	maxScriptLoadingTimeMs,
}: Required<
	Pick<
		useLoadMSFTCookieScriptOptions,
		'cookieScriptTagId' | 'cookieScriptSrc' | 'maxScriptLoadingTimeMs'
	>
>): Promise<void> {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.id = cookieScriptTagId
		script.crossOrigin = 'anonymous'
		script.src = cookieScriptSrc
		document.head.appendChild(script)

		let totalLoadingTime = 0
		function isLoaded(): void {
			if (isCookieScriptLoaded(cookieScriptTagId)) {
				resolve()
			} else {
				if (totalLoadingTime >= maxScriptLoadingTimeMs) {
					reject(
						new Error(
							`Error loading ${cookieScriptSrc}. Failed to load script in ${maxScriptLoadingTimeMs} ms.`,
						),
					)
				}
				totalLoadingTime += CHECK_FOR_LOADING_STATUS_EVERY_MS
				setTimeout(isLoaded, CHECK_FOR_LOADING_STATUS_EVERY_MS)
			}
		}

		isLoaded()
	})
}

function isCookieBannerPlaceholderElementPresent(
	cookieConsentBannerId: string,
): boolean {
	return !!document.getElementById(cookieConsentBannerId)
}

function addCookieBannerPlaceholderElement(
	cookieConsentBannerId: string,
): void {
	const div = document.createElement('div')
	div.id = cookieConsentBannerId
	document.body.prepend(div)
}
