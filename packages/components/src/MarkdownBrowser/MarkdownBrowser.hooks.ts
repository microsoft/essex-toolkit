/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useIconButtonStyles } from './MarkdownBrowser.styles.js'

export function useHistory(home?: string): {
	current: string | undefined
	goHome?: () => void
	goBack?: () => void
	goForward: (to: string) => void
} {
	const [stack, setStack] = useState<string[]>([])
	// reset the stack and go to the original
	const goHome = useCallback(() => setStack(home ? [home] : []), [home])
	const goBack = useCallback(
		() => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
		[],
	)
	const goForward = useCallback(
		(to: string) => setStack((prev) => [...prev, to]),
		[],
	)
	useEffect(() => setStack(home ? [home] : []), [home])
	return {
		current: stack[stack.length - 1],
		goHome: stack.length > 1 ? goHome : undefined,
		goBack: stack.length > 1 ? goBack : undefined,
		goForward,
	}
}

/**
 * Override link click behavior to intercept relative links.
 * @param container
 * @param goForward
 * @param current
 */
export function useLinkNavigation(
	parent: string,
	href: string,
	goForward: (to: string) => void,
) {
	return useCallback(
		(
			event: React.MouseEvent<
				HTMLAnchorElement | HTMLButtonElement | HTMLElement
			>,
		) => {
			event.preventDefault()
			// if the link is not relative, open in a new window
			if (isExternalLink(href)) {
				return window.open(href, '_blank')
			}
			// otherwise, navigate to the relative link
			const name = parseRelativePath(href, parent)
			if (name) {
				goForward(name)
			}
		},
		[parent, href, goForward],
	)
}

export function useIconButtonProps(
	iconName: string,
	onClick?: any,
	overrides?: IButtonProps,
): IButtonProps {
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

/**
 * Construct the props for an icon
 * specific to external links.
 * @param url
 */
export function useLinkIconProps(url: string) {
	return useMemo(
		() => ({
			styles: {
				root: {
					marginLeft: 2,
					fontSize: '0.8em',
					width: '0.8em',
					height: '0.8em',
				},
			},
			iconName: 'NavigateExternalInline',
			// we have to provide separate click handling for the icon
			onClick: () => window.open(url, '_blank'),
		}),
		[url],
	)
}

// We have to do a little housekeeping on the paths to navigate relative content
// The content must use "." to separate paths in order to be JS-compliant,
// we want to look for nested paths and align them with the parent
// to ensure the entire structure remains intact as a key into the content index
function parseRelativePath(path: string, parent: string) {
	const relative = path.replace(window.location.origin, '').replace(/.md/, '')
	const parts = relative.split('/')
	const parentParts = parent.split(/\./g)

	// sibling, push it into the same "folder"
	if (parts[0] === '.') {
		return [
			...parentParts.slice(0, parentParts.length - 1),
			...parts.slice(1),
		].join('.')
	}

	// if it's nested deeper, slice out the correct number of levels
	const levels = parts.filter((p) => p === '..').length
	if (levels > 0) {
		return [
			...parentParts.slice(0, parentParts.length - (levels + 1)),
			...parts.slice(levels),
		].join('.')
	}

	// fallback for unaccounted for path structures
	return relative.replace(/\//g, '.')
}

/**
 * Relative paths should either include the origin or have no protocol.
 * @param url
 * @returns
 */
export function isExternalLink(url: string) {
	if (url.includes(':')) {
		return !url.includes(window.location.origin)
	}
	return false
}
