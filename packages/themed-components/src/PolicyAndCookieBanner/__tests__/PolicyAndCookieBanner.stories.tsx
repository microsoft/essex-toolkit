/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { PolicyAndCookieBanner } from '../index.js'

const meta = {
	title: '@essex:themed-components/Policy and Cookie Banner',
}

export default meta

export const PolicyAndCookieBannerStory = () => {
	/**
	 * PolicyAndCookieBanner is banner that will display MSFT policy links.
	 * The banner will also display cookie banner and cookie settings for
	 * regions requiring a cookie banner.
	 *
	 * The Cookies link in the banner - which manages user cookie preferences -
	 * is only displayed in regions that require cookie consent. Othwerwise the
	 * Cookies link is not displayed. Likewise is true for the cookie banner.
	 * The banner will only popup and be displayed at the top of the page
	 * in regions where cookie consent is required.
	 *
	 * NOTE: This component automatically loads MSFT cookie banner script.
	 * There is no need to add any aditional script tags to the index.html
	 * page when using this component.
	 */
	return <PolicyAndCookieBanner />
}
PolicyAndCookieBannerStory.story = {
	name: 'Simple use case',
}

export const PolicyAndCookieBannerThemeStory = () => {
	/**
	 * theme: 'light' | 'dark' | 'high-contrast' - themes the cookie popup banner that
	 * MSFT managers. This does not theme the Policy banner (footer), only the popups.
	 *
	 * The overall policy banner styles are controlled by fluent components and classNames
	 * See the styling example
	 */
	return <PolicyAndCookieBanner theme={'dark'} />
}
PolicyAndCookieBannerThemeStory.story = {
	name: 'Theming cookie banner',
}

export const PolicyAndCookieBannerListeningForCookieChangesStory = () => {
	/**
	 * Listen for when users change their cookie preferences.
	 *
	 * If a site is using non-essential cookies then you must liten
	 * to changes in cookie preferences and respond accordiningly, usually by letting
	 * the backend know and by deleting removed cookies if the site is using cookies.
	 *
	 * If the site is not using cookies or is using essential cookies only (Auth, GH cookies, etc)
	 * then there is no need to listen to cookie preference changes and this callback may be left blank.
	 *
	 */
	return (
		<PolicyAndCookieBanner
			onConsentChanged={consents => {
				console.log(consents)
			}}
		/>
	)
}
PolicyAndCookieBannerListeningForCookieChangesStory.story = {
	name: 'Listen for cookie consent changes',
}

export const PolicyAndCookieBannerStylingStory = () => {
	/**
	 * This component uses Fluent Text and Link components so it should
	 * automatically respond to light mode and dark mode changes.
	 *
	 * The component supports className so it can be styled with StyledComponents
	 * and supports a React.CSSProperties styles object for styling the overall div.
	 */
	return (
		<PolicyAndCookieBanner
			className="some-class-perhaps-provided-by-StyledComponets"
			styles={{ flexDirection: 'column' }}
		/>
	)
}
PolicyAndCookieBannerStylingStory.story = {
	name: 'Styling',
}

export const PolicyAndCookieBannerCustomLinksStory = () => {
	/**
	 * This component accepts a list of links to display instead of
	 * the standard list of policy links. This option is provided in case
	 * MSFT changes policy requirements in the future either the link locations
	 * or which links to display. In that case it is possible for individual
	 * apps to provide the newly required/updated policy links using this prop
	 * without having to wait for a new version of this component to be released.
	 * The only exception is the Cookies link. The Cookies link is prepended to the
	 * list dynamically based on the MSFT cookie banner API. If the cookie banner
	 * API changes then a new version of this component will need to be released in response.
	 */
	return (
		<PolicyAndCookieBanner
			links={[{ name: 'Bing', href: 'https://bing.com' }]}
		/>
	)
}
PolicyAndCookieBannerCustomLinksStory.story = {
	name: 'Custom links',
}
