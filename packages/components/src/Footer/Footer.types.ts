/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * @public
 */
export type FooterLinkDetails = { name: string; href: string}

/**
 * Defaults to {
 * 	language: navigator.language ?? 'en-US'
 * 	onConsentChange: () => void,
 *  links: [
 *		{
		name: 'Privacy & Cookies',
		href: ' https://go.microsoft.com/fwlink/?LinkId=521839',
	},
	{
		name: 'Terms of Use',
		href: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	},
	{
		name: 'Trademarks',
		href: 'https://www.microsoft.com/trademarks',
	},
    {
        name: 'Consumer Health Privacy',
        href: 'https://go.microsoft.com/fwlink/?LinkId=2259814',
    },
	{
		name: 'Github',
		href: 'https://github.com/microsoft/datashaper',
	},
	{
		name: `©️ ${new Date().getFullYear()} Microsoft`,
		href: 'https://www.microsoft.com',
	},
 *	]
 * }
 *
 * @public
 */
export type FooterProps = {
	links?: Array<FooterLinkProps>
}

/**
 * @internal
 */
export type FooterLinkProps = {
	name: string
	id?: string
	href?: string
	onClick?: () => void
	divider?: boolean
	hide?: boolean
}