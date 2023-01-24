/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, IconButton } from '@fluentui/react'
import { memo, PropsWithChildren, useRef } from 'react'

import {
	isExternalLink,
	useHistory,
	useIconButtonProps,
	useLinkIconProps,
	useLinkNavigation,
} from './MarkdownBrowser.hooks.js'
import {
	Container,
	MarkdownContainer,
	Navigation,
} from './MarkdownBrowser.styles.js'
import type { MarkdownBrowserProps } from './MarkdownBrowser.types.js'

/**
 * A component for rendering markdown that supports relative navigation.
 * If you have a collection of markdown files (e.g., documentation),
 * this component will render the content, but intercept link clicks to
 * load relative content in the same pane.
 *
 * External links will open in a new tab/window.
 */
export const MarkdownBrowser: React.FC<MarkdownBrowserProps> = memo(
	function MarkdownBrowser({
		home,
		content,
		styles = {},
		backButtonProps,
		homeButtonProps,
	}) {
		const container = useRef<HTMLDivElement>(null)
		const { current, goHome, goBack, goForward } = useHistory(home)

		useLinkNavigation(container, goForward, current)

		// fallback to empty string - markdown component will fail if content is undefined
		const md = current ? content[current] : ''

		const backProps = useIconButtonProps('Back', goBack, backButtonProps)
		const homeProps = useIconButtonProps('Home', goHome, homeButtonProps)
		return (
			<Container ref={container} style={styles.root}>
				<Navigation style={styles.navigation}>
					{goBack && <IconButton {...backProps} />}
					{goHome && <IconButton {...homeProps} />}
				</Navigation>
				{md && (
					<MarkdownContainer options={options} style={styles.markdown}>
						{md}
					</MarkdownContainer>
				)}
			</Container>
		)
	},
)

const Link = (props: PropsWithChildren<any>) => {
	const { children, href, ...rest } = props
	const isExternal = isExternalLink(href)
	const iconProps = useLinkIconProps(href)
	return (
		<a href={href} {...rest}>
			{children}
			{isExternal && <Icon {...iconProps} />}
		</a>
	)
}

const options = {
	overrides: {
		a: {
			component: Link,
		},
	},
}
