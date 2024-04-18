/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	PolicyAndCookieBanner,
	defaultBannerLinks,
} from './PolicyAndCookieBanner.js'
import type { PolicyAndCookieBannerProps } from './PolicyAndCookieBanner.types.js'

const meta = {
	title: '@essex:components/PolicyAndCookieBanner',
	args: {
		onError: window.alert.bind(window),
	},
}

export default meta

export const Simple = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	name: 'Simple use case',
}

export const Theme = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		theme: 'dark',
	},

	name: 'Theming cookie banner',
}

export const CookieChanges = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		onConsentChange: (consents) => console.log(consents),
	},

	name: 'Listen for cookie consent changes',
}

export const Styling = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		className: 'some-class-perhaps-provided-by-StyledComponets',
		styles: { flexDirection: 'column' },
	},

	name: 'Styling',
}

export const CustomLinks = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		links: [{ name: 'Bing', href: 'https://bing.com' }],
	},

	name: 'Custom links (overrride)',
}

export const AdditionalLinks = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		links: [...defaultBannerLinks, { name: 'Bing', href: 'https://bing.com' }],
	},

	name: 'Additional links',
}

export const ExtendedItemsCustomization = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		links: [...defaultBannerLinks, { name: 'Clickable', onClick: () => {alert("Testing props")}},],
	},

	name: 'Extended Items Customization',
}

export const HideShowItemsCustomization = {
	render: (args: PolicyAndCookieBannerProps) => (
		<PolicyAndCookieBanner {...args} />
	),

	args: {
		links: [...defaultBannerLinks, { name: 'Hide item', href: '', hide: true}, { name: 'Show item', href: ''},],
	},

	name: 'Hide/Show Items Customization',
}
