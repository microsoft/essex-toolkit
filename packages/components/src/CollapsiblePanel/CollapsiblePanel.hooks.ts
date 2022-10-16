/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useIconStyles } from './CollapsiblePanel.styles.js'

export function useEventHandlers(
	defaultExpanded: boolean,
	expanded?: boolean,
	onHeaderClick?: any,
) {
	const [expandedState, setExpanded] = useState<boolean>(defaultExpanded)

	useEffect(() => {
		if (expanded !== undefined) {
			setExpanded(expanded)
		}
	}, [setExpanded, expanded])

	const handleClick = useCallback(() => {
		// if not controlled component, set local state
		if (expanded === undefined) {
			setExpanded(!expandedState)
		}
	}, [expandedState, expanded])

	const handleHeaderClick = useCallback(() => {
		if (onHeaderClick) {
			onHeaderClick(!expandedState)
		} else {
			handleClick()
		}
	}, [handleClick, onHeaderClick, expandedState])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if ('ArrowLeft' === event.key && expandedState) {
				return handleClick()
			}

			if ('ArrowRight' === event.key && !expandedState) {
				return handleClick()
			}
		},
		[handleClick, expandedState],
	)

	const handleHeaderKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if ('Enter' === event.key || ' ' === event.key) {
				return handleHeaderClick()
			}
		},
		[handleHeaderClick],
	)

	return {
		expandedState,
		handleClick,
		handleKeyDown,
		handleHeaderKeyDown,
		handleHeaderClick,
	}
}

export function useIconProps(
	buttonProps?: IButtonProps,
	expanded?: boolean,
	iconSize = 10,
) {
	const styles = useIconStyles(buttonProps, iconSize)
	return useMemo(
		() =>
			merge(
				{
					iconProps: {
						iconName: expanded ? 'ChevronDown' : 'ChevronRight',
						styles,
					},
					styles: {
						root: {
							width: iconSize * 2,
							height: iconSize * 2,
						},
					},
				},
				buttonProps,
			),
		[buttonProps, expanded, styles, iconSize],
	)
}
