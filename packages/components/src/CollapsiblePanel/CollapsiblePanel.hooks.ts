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
	onIconClick?: any,
) {
	const [expandedState, setExpanded] = useState<boolean>(defaultExpanded)

	useEffect(() => {
		if (expanded !== undefined) {
			setExpanded(expanded)
		}
	}, [setExpanded, expanded])

	// these two handlers will defer to user-specified clicks if defined
	// otherwise they will check for controlled expanded state and manage it internally if absent
	const handleIconClick = useCallback(() => {
		if (onIconClick) {
			onIconClick()
		} else if (expanded === undefined) {
			setExpanded(prev => !prev)
		}
	}, [onIconClick, setExpanded, expanded])

	const handleHeaderClick = useCallback(() => {
		if (onHeaderClick) {
			onHeaderClick()
		} else if (expanded === undefined) {
			setExpanded(prev => !prev)
		}
	}, [onHeaderClick, setExpanded, expanded])

	const handleIconKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if ('ArrowLeft' === event.key && expandedState) {
				return handleIconClick()
			}

			if ('ArrowRight' === event.key && !expandedState) {
				return handleIconClick()
			}
		},
		[handleIconClick, expandedState],
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
		handleIconClick,
		handleIconKeyDown,
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
