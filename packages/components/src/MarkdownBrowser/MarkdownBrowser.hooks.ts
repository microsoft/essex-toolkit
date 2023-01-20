/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useIconButtonStyles } from './MarkdownBrowser.styles.js'

export function useHistory(home: string) {
	const [stack, setStack] = useState<string[]>([home])
	// reset the stack and go to the original
	const goHome = useCallback(() => setStack([home]), [home])
	const goBack = useCallback(
		() => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
		[],
	)
	const goForward = useCallback(
		(to: string) => setStack((prev) => [...prev, to]),
		[],
	)
	return {
		current: stack[stack.length - 1],
		goHome: stack.length > 1 ? goHome : undefined,
		goBack: stack.length > 1 ? goBack : undefined,
		goForward,
	}
}

export function useLinkNavigation(
	container: any,
	goForward: any,
	current: string,
) {
	const onLinkClick = useCallback(
		(url: string) => {
			// if the link is not relative, open in a new window
			if (!url.includes(window.location.origin)) {
				return window.open(url, '_blank')
			}
			// otherwise, navigate to the relative link
			// TODO: this only supports last path segment
			// we could potentially provide better support for nested documentation paths
			const name = url.split('/').pop()?.replace(/.md/, '')
			if (name) {
				goForward(name)
			}
		},
		[goForward],
	)
	// override link click behavior to intercept relative links
	// note the inclusion of the current value in the deps to trigger re-attachment of handlers
	// because refs don't trigger re-renders
	useEffect(() => {
		if (container?.current) {
			const links = container.current.querySelectorAll('a')
			links.forEach((link: any) => {
				link.addEventListener('click', (e: any) => {
					e.preventDefault()
					onLinkClick((e.target as HTMLAnchorElement).href)
				})
			})
		}
	}, [onLinkClick, container, current])
}

export function useIconButtonProps(
	iconName: string,
	onClick?: any,
	overrides?: IButtonProps,
) {
	const styles = useIconButtonStyles()
	return useMemo(() => {
		return merge(
			{
				disabled: !onClick,
				styles,
				iconProps: {
					iconName,
				},
				ariaLabel: iconName,
				onClick,
			},
			overrides,
		)
	}, [styles, iconName, onClick, overrides])
}
