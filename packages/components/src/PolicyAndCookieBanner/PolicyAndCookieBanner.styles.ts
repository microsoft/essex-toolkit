/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.footer`
	width: 100%;
	height: 32px;
	font-size: 12px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 18px;
	align-items: center;
	color: ${({ theme }) => theme.palette.neutralSecondary};
	background: ${({ theme }) => theme.palette.neutralLight};
	border-top: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const LinkDiv = styled.div`
	cursor: pointer;
`
export const LinkA = styled.a`
	cursor: pointer;
	text-decoration: none !important;
`
