/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import AnimateHeight from '@essex/react-animate-height'
import { IconButton } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import * as React from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import type { CollapsiblePanelProps } from './CollapsiblePanel.types.js'

/**
 * CollapsiblePanel displays a Header and it's child
 * that collapse and expands with keyboard arrows, space, enter or onclick
 * showing the 'hidden' rendering
 */
export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
	title,
	defaultExpanded = false,
	expandedState,
	first,
	last,
	children,
	onRenderHeader,
	onHeaderClick,
	expandsWithIcon = false,
	styles = {
		header: {},
		contents: {},
	},
}) => {
	const theme = useThematicFluent()
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded)
	const handleClick = useCallback(() => {
		// if not controlled component, set local state
		if (expandedState === undefined) {
			setExpanded(!expanded)
		}
	}, [expanded, expandedState])

	const handleHeaderClick = useCallback(() => {
		if (onHeaderClick) {
			onHeaderClick(!expanded)
		}
		!expandsWithIcon && handleClick()
	}, [handleClick, onHeaderClick, expandsWithIcon, expanded])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if ('ArrowLeft' === event.key && expanded) {
				return handleClick()
			}

			if ('ArrowRight' === event.key && !expanded) {
				return handleClick()
			}
		},
		[handleClick, expanded],
	)

	const handleHeaderKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if ('Enter' === event.key || ' ' === event.key) {
				return handleHeaderClick()
			}
		},
		[handleHeaderClick],
	)

	useEffect(() => {
		if (expandedState !== undefined) {
			setExpanded(expandedState)
		}
	}, [setExpanded, expandedState])

	const iconProps = useIconProps(expanded, expandsWithIcon ? 12 : 10)
	const header = useMemo(() => {
		if (onRenderHeader) {
			return onRenderHeader()
		}
		return (
			<div
				role="group"
				//the element is interactive when tabIndex is defined
				//eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={expandsWithIcon ? 0 : undefined}
				onKeyDown={expandsWithIcon ? handleHeaderKeyDown : undefined}
				onClick={expandsWithIcon ? handleHeaderClick : undefined}
				style={HeaderLabelStyle}
			>
				{title}
			</div>
		)
	}, [
		onRenderHeader,
		title,
		handleHeaderClick,
		handleHeaderKeyDown,
		expandsWithIcon,
	])
	const contentsStyle = useMemo(
		() => ({
			border: expanded
				? `1px solid ${theme.application().faint().hex()}`
				: 'none',
			...styles.contents,
		}),
		[expanded, theme, styles.contents],
	)
	return (
		<div>
			<HeaderContainer
				first={first}
				last={last}
				expanded={expanded}
				onKeyDown={!expandsWithIcon ? handleKeyDown : undefined}
				onClick={!expandsWithIcon ? handleHeaderClick : undefined}
				style={styles.header}
			>
				<div
					onKeyDown={expandsWithIcon ? handleKeyDown : undefined}
					onClick={expandsWithIcon ? handleClick : undefined}
					style={ButtonContainerStyle}
				>
					<IconButton
						title="collapse"
						iconProps={iconProps}
						style={{
							...IconButtonStyle,
							color:
								styles?.header?.color || theme.application().foreground().hex(),
						}}
					/>
				</div>
				{header}
			</HeaderContainer>
			<div style={contentsStyle}>
				<AnimateHeight duration={500} height={expanded ? 'auto' : 0}>
					{children}
				</AnimateHeight>
			</div>
		</div>
	)
}

function useIconProps(expanded?: boolean, iconSize = 10) {
	return useMemo(
		() => ({
			iconName: expanded ? 'ChevronDown' : 'ChevronRight',
			styles: {
				root: {
					width: iconSize,
					height: iconSize,
					fontSize: iconSize,
					lineHeight: iconSize,
				},
			},
		}),
		[expanded, iconSize],
	)
}

const ButtonContainerStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	height: '100%',
}

const HeaderLabelStyle: React.CSSProperties = {
	marginLeft: 4,
	fontSize: '0.8em',
	width: '100%',
}

const HeaderContainerStyle: React.CSSProperties = {
	paddingTop: 2,
	paddingBottom: 2,
	display: 'flex',
	alignContent: 'center',
	cursor: 'pointer',
	width: '100%',
}
const HeaderContainer: React.FC<{
	first?: boolean
	last?: boolean
	expanded?: boolean
	onClick?: () => void
	onKeyDown?: (ev: React.KeyboardEvent) => void
	style?: React.CSSProperties
	children?: React.ReactNode
}> = memo(function HeaderContainer({
	first,
	last,
	expanded,
	children,
	onClick,
	onKeyDown,
	style = {},
}) {
	const theme = useThematicFluent()
	const _style = useMemo<React.CSSProperties>(() => {
		const background = theme.application().faint().hex()
		const borderTop = first
			? ''
			: `1px solid ${theme.application().lowContrast().hex()}`
		const borderBottom =
			last || expanded
				? `1px solid ${theme.application().lowContrast().hex()}`
				: ''
		return {
			...HeaderContainerStyle,
			background,
			borderTop,
			borderBottom,
			...style,
		}
	}, [first, last, expanded, theme, style])
	return (
		<div style={_style} onClick={onClick} onKeyDown={onKeyDown} role="group">
			{children}
		</div>
	)
})

const IconButtonStyle: React.CSSProperties = {
	width: 20,
	height: 20,
}
