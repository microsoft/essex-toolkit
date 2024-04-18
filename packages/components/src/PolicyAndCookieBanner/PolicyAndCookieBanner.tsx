/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link, Text, useTheme } from '@fluentui/react'
import type { CSSProperties, FC } from 'react'
import { memo, useMemo } from 'react'

import { useLoadMSFTCookieScript } from './PolicyAndCookieBanner.hooks.js'
import { Container } from './PolicyAndCookieBanner.styles.js'
import type {
	PolicyAndCookieBannerProps,
	PolicyLinkDetails,
	PolicyLinkProps,
} from './PolicyAndCookieBanner.types.js'

const containerStyles: CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: '20px',
	padding: '10px',
}

export const defaultBannerLinks: Array<PolicyLinkDetails> = [
	{
		name: 'Privacy & Cookies',
		href: ' https://go.microsoft.com/fwlink/?LinkId=521839',
	},
	{
		name: 'Terms of Use',
		href: 'https://go.microsoft.com/fwlink/?LinkID=760869',
	},
	{
		name: 'Trademarks',
		href: 'https://www.microsoft.com/en-us/legal/intellectualproperty/Trademarks/EN-US.aspx',
	},
	{
		name: 'Contact Us',
		href: 'https://go.microsoft.com/?linkid=2028325',
	},
	{
		name: 'Code of Conduct',
		href: 'https://opensource.microsoft.com/codeofconduct/',
	},
	{
		name: `©️ ${new Date().getFullYear()} Microsoft`,
		href: 'https://www.microsoft.com/en-us/legal/intellectualproperty/copyright',
	},
]

export const PolicyAndCookieBanner: FC<PolicyAndCookieBannerProps> = memo(
	function CookieConsentProvider({
		language = navigator.language ?? 'en-US',
		onConsentChange = () => undefined,
		onError,
		className,
		styles,
		links = defaultBannerLinks,
	}) {
		const theme = useTheme()
		const divStyles: CSSProperties = useMemo(() => {
			return {
				...containerStyles,
				...styles,
			}
		}, [styles])

		const policyLinks = useMemo(() => {
			return links.map(({ name, href, onClick, hide }, i) => {
				return hide === false || hide === undefined ? (
					<PolicyLink
						key={name}
						divider={i !== 0}
						name={name}
						href={href}
						onClick={onClick}
					/>
				) : null
			})
		}, [links])

		const consentManager = useLoadMSFTCookieScript({
			language,
			theme: theme.isInverted ? 'dark' : 'light',
			onConsentChange,
			onError,
		})

		return (
			<Container className={className} style={divStyles}>
				{consentManager?.isConsentRequired && (
					<>
						<PolicyLink
							name='Manage Cookies'
							id='MSFTManageCookiesLink'
							onClick={() => {
								consentManager?.manageConsent()
							}}
						/>
						<Text variant='tiny'>|</Text>
					</>
				)}
				{policyLinks}
			</Container>
		)
	},
)
PolicyAndCookieBanner.displayName = 'PolicyAndCookieBanner'

const PolicyLink: FC<PolicyLinkProps> = memo(function PolicyLink({
	name,
	href,
	onClick,
	divider = false,
	id,
}) {
	return href == null || href === '' ? (
		<>
			{divider && <Text variant='tiny'>|</Text>}
			<Text variant='smallPlus'>
				<Link id={id} target='_blank' onClick={onClick}>
					{name}
				</Link>
			</Text>
		</>
	) : (
		<>
			{divider && <Text variant='tiny'>|</Text>}
			<Text variant='smallPlus'>
				<Link id={id} href={href} target='_blank'>
					{name}
				</Link>
			</Text>
		</>
	)
})
