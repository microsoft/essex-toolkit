/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CSSProperties } from 'react'

/**
 * @public
 */
export enum CookieConsentCategories {
	/**
	 * Cookies to perform essential website functions (sign-in, language settings,...)
	 */
	Required = 'Required',
	/**
	 * Cookies to understand how website is used, may be also used on 3rd party websites that are not owned or operated by Microsoft
	 */
	Analytics = 'Analytics',
	/**
	 * Cookies to show ads and content based on user social media profiles and activity on Microsoft websites
	 */
	SocialMedia = 'SocialMedia',
	/**
	 * Cookies to record which ads are already seen, clicked, or purchased
	 */
	Advertising = 'Advertising',
}

/**
 * Theme of the cookie consent banner popup that is managed by
 * the wcp script. This sets the theme for the popup only and
 * does not impact the theme of the policy footer or links.
 * The policy footer uses FluentUI so it should pick up the theme from
 * parent FluentUI theme provider.
 *
 *  @public
 */
export type CookieConsentBannerThemes = 'light' | 'dark' | 'high-contrast'

/**
 * Record of approved and blocked cookie types.
 *
 * Record<"Required" | "Analytics" | "SocialMedia" | "Advertising", boolean>
 *
 * @public
 */
export type CookieConsent = Record<CookieConsentCategories, boolean>

/**
 * @internal
 */
export type CookieConsentManager = {
	readonly isConsentRequired: boolean

	getConsent(): CookieConsent

	getConsentFor(consentCategory: CookieConsentCategories): boolean

	manageConsent(): void
}

/**
 * @internal
 */
export type WcpConsent = {
	/**
	 * Library initialization method
	 * @param culture - culture to be used for text resources (e.g.: `en-us`, `en-gb`, `en`, `fr-ca`)
	 * @param placeholderIdOrElement - element ID or HTMLElement where banner will be placed
	 * @param initCallback - function to be called when the library initialization is done
	 * @param onConsentChanged - function to be called when user changes consent state
	 * @param theme - theme that will be applied to the banner(available themes - dark, light, highcontrast)
	 * @param stylesNonce - optional nonce value (unique base64 string), which will be applied for all generated styles tag. Nonce is used for Content Security Policy (CSP)
	 */
	init: (
		culture: string,
		placeholderIdOrElement: string | HTMLElement,
		initCallback?: (err?: Error, siteConsent?: CookieConsentManager) => void,
		onConsentChanged?: (newConsent: CookieConsent) => void,
		theme?: CookieConsentBannerThemes,
		stylesNonce?: string,
	) => void
}

/**
 * @public
 */
export type PolicyLinkDetails = {
	name: string
	href?: string
	onClick?: () => void
	hide?: boolean
}

/**
 * Defaults to {
 * 	language: navigator.language ?? 'en-US'
 * 	theme: 'light',
 * 	onConsentChange: () => void,
 *  links: [
 *		{
 *			name: 'Privacy & Cookies',
 *			href: ' https://go.microsoft.com/fwlink/?LinkId=521839',
 *		},
 *		{
 *			name: 'Terms of Use',
 *			href: 'https://go.microsoft.com/fwlink/?LinkID=760869',
 *		},
 *		{
 *			name: 'Trademarks',
 *			href: 'https://www.microsoft.com/en-us/legal/intellectualproperty/Trademarks/EN-US.aspx',
 *		},
 *		{
 *			name: 'Contact Us',
 *			href: 'https://go.microsoft.com/?linkid=2028325',
 *		},
 *		{
 *			name: 'Code of Conduct',
 *			href: 'https://opensource.microsoft.com/codeofconduct/',
 *		},
 *		{
 *			name: `©️ ${new Date().getFullYear()} Microsoft`,
 *			href: 'https://www.microsoft.com/en-us/legal/intellectualproperty/copyright',
 *		},
 *	]
 * }
 *
 * @public
 */
export type PolicyAndCookieBannerProps = {
	language?: string
	theme?: CookieConsentBannerThemes
	onConsentChange?: (newConsent: CookieConsent) => void
	onError: (error: unknown) => void
	className?: string
	styles?: CSSProperties
	links?: Array<PolicyLinkDetails>
}

/**
 * @internal
 */
export type PolicyLinkProps = {
	name: string
	id?: string
	href?: string
	onClick?: () => void
	divider?: boolean
}
