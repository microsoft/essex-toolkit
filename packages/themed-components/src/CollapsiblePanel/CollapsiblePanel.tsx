/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useCallback, useMemo, useState, useEffect } from 'react'
import * as React from 'react'
import { default as AnimateHeight } from 'react-animate-height'
import styled from 'styled-components'
import { CollapsiblePanelProps } from './interfaces'

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
		[handleClick],
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
		return <HeaderLabel>{title}</HeaderLabel>
	}, [onRenderHeader, title])

	return (
		<Container>
			<HeaderContainer
				first={first}
				last={last}
				expanded={expanded}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<ButtonContainer>
					<StyledIconButton title="collapse" iconProps={iconProps} />
				</ButtonContainer>
				{header}
			</HeaderContainer>
			<Contents expanded={expanded}>
				<AnimateHeight duration={500} height={expanded ? 'auto' : 0}>
					{children}
				</AnimateHeight>
			</Contents>
		</Container>
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

const Container = styled.div``

const Contents = styled.div<{ expanded: boolean }>`
	border: ${({ theme, expanded }) => {
		return expanded ? `1px solid ${theme.application().faint().hex()}` : 'none'
	}};
`
const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
`

const HeaderContainer = styled.div<{
	first?: boolean
	last?: boolean
	expanded?: boolean
}>`
	padding-top: 2px;
	padding-bottom: 2px;
	display: flex;
	align-content: center;
	cursor: pointer;
	background: ${({ theme }) => theme.application().faint().hex()};
	border-top: ${({ theme, first }) =>
		first ? '' : `1px solid ${theme.application().lowContrast().hex()}`};
	border-bottom: ${({ theme, last, expanded }) =>
		last || expanded
			? `1px solid ${theme.application().lowContrast().hex()}`
			: ''};
	width: 100%;
`

const HeaderLabel = styled.div`
	margin-left: 4px;
	font-size: 0.8em;
	width: 100%;
`

// override default button accent color for a more seamless look
const StyledIconButton = styled(IconButton)`
	width: 18px;
	height: 18px;
	color: ${({ theme }) => theme.application().foreground().hex()};
	button-border: red;
`
