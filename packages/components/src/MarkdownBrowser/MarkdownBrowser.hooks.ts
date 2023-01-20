/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Dispatch, SetStateAction, useCallback,useEffect, useMemo, useState  } from 'react'

export function useHistory(home: string) {
	const [stack, setStack] = useState<string[]>([home])

	// reset the stack and go to the original
	const goHome = useCallback(() => setStack([home]), [home])
	const goBack = useCallback(() => setStack((prev) => {
		if (prev.length > 1) {
			return prev.slice(0, -1)
		}
		return prev
	}), [])
	const goForward = useCallback((next: string) => setStack((prev) => {
		return [...prev, next]
	}), [])
	console.log('stack', stack)
	return {
		current: stack[stack.length - 1],
		goHome: stack.length > 1 ? goHome : undefined,
		goBack: stack.length > 1 ? goBack : undefined,
		goForward
	}
}


export function useIndexed(
	index: Record<string, string>,
): (name: string) => string {
	return useCallback(
		(name: string) => {
			return index[name] || ''
		},
		[index],
	)
}

export function useLinkNavigation(container: any, goForward: any, current: string) {
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
	useEffect(() => {
		if (container?.current) {
			const links = container.current.querySelectorAll('a')
			// override link click behavior to intercept relative links
			links.forEach((link: any) => {
				link.addEventListener('click', (e: any) => {
					e.preventDefault()
					onLinkClick((e.target as HTMLAnchorElement).href)
				})
			})
		}
	}, [onLinkClick, container, current])
}