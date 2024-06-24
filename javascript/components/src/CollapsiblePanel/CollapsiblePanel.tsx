/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import type { PropsWithChildren } from 'react'
import AnimateHeight from 'react-animate-height'

import { useEventHandlers, useIconProps } from './CollapsiblePanel.hooks.js'
import { useStyles } from './CollapsiblePanel.styles.js'
import type { CollapsiblePanelProps } from './CollapsiblePanel.types.js'

/**
 * CollapsiblePanel displays a Header and its child
 * that collapse and expands with keyboard arrows, space, enter or onclick
 * showing the 'hidden' rendering
 */
export const CollapsiblePanel: React.FC<
	PropsWithChildren<CollapsiblePanelProps>
> = ({
	title,
	defaultExpanded = false,
	expanded,
	first,
	last,
	children,
	onRenderHeader,
	onHeaderClick,
	onIconClick,
	hideIcon = false,
	styles,
	duration = 300,
	buttonProps,
}) => {
	const {
		expandedState,
		handleIconClick,
		handleIconKeyDown,
		handleHeaderKeyDown,
		handleHeaderClick,
	} = useEventHandlers(defaultExpanded, expanded, onHeaderClick, onIconClick)

	const _styles = useStyles(styles, expandedState, first, last)
	const _buttonProps = useIconProps(buttonProps, expandedState)

	return (
		<div style={_styles.root}>
			<div style={_styles.header}>
				{!hideIcon && (
					<IconButton
						title={expandedState ? 'collapse' : 'expand'}
						onKeyDown={handleIconKeyDown as any}
						onClick={handleIconClick}
						{..._buttonProps}
					/>
				)}
				<div
					role="button"
					tabIndex={onHeaderClick ? 0 : undefined}
					onKeyDown={handleHeaderKeyDown}
					onClick={handleHeaderClick}
					style={_styles.titleContainer}
				>
					{onRenderHeader ? (
						onRenderHeader()
					) : (
						<div style={_styles.title}>{title}</div>
					)}
				</div>
			</div>
			<div style={_styles.content}>
				<AnimateHeight duration={duration} height={expandedState ? 'auto' : 0}>
					{children}
				</AnimateHeight>
			</div>
		</div>
	)
}
