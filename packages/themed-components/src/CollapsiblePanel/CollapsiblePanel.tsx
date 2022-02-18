/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { IconButton } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import { useCallback, useMemo, useState, useEffect, memo } from 'react'
import { default as AnimateHeight } from 'react-animate-height'
import { CollapsiblePanelProps } from './interfaces.js'

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
}) => {
	const theme = useThematicFluent()
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded)
	const handleClick = useCallback(() => {
		if (onHeaderClick) {
			onHeaderClick(!expanded)
		}
		// if not controlled component, set local state
		if (expandedState === undefined) {
			setExpanded(!expanded)
		}
	}, [expanded, onHeaderClick, expandedState])

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

	useEffect(() => {
		if (expandedState !== undefined) {
			setExpanded(expandedState)
		}
	}, [setExpanded, expandedState])

	const iconProps = useIconProps(expanded)
	const header = useMemo(() => {
		if (onRenderHeader) {
			return onRenderHeader()
		}
		return <div style={HeaderLabelStyle}>{title}</div>
	}, [onRenderHeader, title])
	const contentsStyle = useMemo(
		() => ({
			border: expanded
				? `1px solid ${theme.application().faint().hex()}`
				: 'none',
		}),
		[expanded, theme],
	)

	return (
		<div>
			<HeaderContainer
				first={first}
				last={last}
				expanded={expanded}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<div style={ButtonContainerStyle}>
					<IconButton
						title="collapse"
						iconProps={iconProps}
						style={{
							...IconButtonStyle,
							color: theme.application().foreground().hex(),
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
	onClick: () => void
	onKeyDown: (ev: React.KeyboardEvent) => void
}> = memo(function HeaderContainer({
	first,
	last,
	expanded,
	children,
	onClick,
	onKeyDown,
}) {
	const theme = useThematicFluent()
	const style = useMemo<React.CSSProperties>(() => {
		const background = theme.application().faint().hex()
		const borderTop = first
			? ''
			: `1px solid ${theme.application().lowContrast().hex()}`
		const borderBottom =
			last || expanded
				? `1px solid ${theme.application().lowContrast().hex()}`
				: ''
		return { ...HeaderContainerStyle, background, borderTop, borderBottom }
	}, [first, last, expanded, theme])
	return (
		<div style={style} onClick={onClick} onKeyDown={onKeyDown} role="group">
			{children}
		</div>
	)
})

const IconButtonStyle: React.CSSProperties = {
	width: 18,
	height: 18,
}
