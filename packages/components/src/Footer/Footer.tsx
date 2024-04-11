/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text, useTheme } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useMemo } from 'react'

import { Container, LinkA, LinkDiv } from './Footer.styles.js'
import type { FooterLinkDetails, FooterProps } from './Footer.types.js'

export const defaultFooterLinks: Array<FooterLinkDetails> = [
	{
		name: 'Privacy & Cookies',
		href: ' https://go.microsoft.com/fwlink/?LinkId=521839',
	},
	{
		name: 'Consumer Health Privacy',
		href: 'https://go.microsoft.com/fwlink/?LinkId=2259814',
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
		name: `©️ ${new Date().getFullYear()} Microsoft`,
		href: 'https://www.microsoft.com',
	},
	{
		name: 'Github',
		href: 'https://github.com/microsoft/essex-toolkit',
	},
]

export const Footer: FC<FooterProps> = memo(function Footer({
	links = defaultFooterLinks,
}) {
	const theme = useTheme()

	// override link color to provide subtle footer while still meeting contrast requirements
	const style = useMemo(
		() => ({ color: theme.palette.neutralSecondary }),
		[theme],
	)

	const footerLinks = useMemo(() => {
		return links.map(({ name, href }, i) => {
			return (
				<Link key={name} divider={i !== 0} style={style} href={href}>
					{name}
				</Link>
			)
		})
	}, [links, style])

	return <Container>{footerLinks}</Container>
})

const Link: FC<
	React.PropsWithChildren<{
		href?: string
		id?: string
		hide?: boolean
		divider: boolean
		className?: string
		style?: React.CSSProperties
		onClick?: () => void
	}>
> = memo(function Link({
	id,
	className,
	divider,
	hide,
	children,
	href,
	style,
	onClick,
}) {
	return (href == null || href === '') && (hide == null || hide === false) ? (
		<>
			{divider && <Text variant='tiny'>|</Text>}
			<LinkDiv style={style} className={className} id={id} onClick={onClick}>
				{children}
			</LinkDiv>
		</>
	) : (
		<>
			{divider && <Text variant='tiny'>|</Text>}
			<LinkA
				target='_blank'
				rel='noreferrer'
				href={href}
				style={style}
				className={className}
				id={id}
			>
				{children}
			</LinkA>
		</>
	)
})
