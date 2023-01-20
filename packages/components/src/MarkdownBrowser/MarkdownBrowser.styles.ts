/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { ITheme } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import Markdown from 'markdown-to-jsx'
import { useMemo } from 'react'

export const Container = styled.div`
    overflow-y: auto;
    height: 100%;
    width: 100%;
`

export const Navigation = styled.div`
    float: right;
`

export const MarkdownContainer = styled(Markdown)`
    *:first-child {
    margin-top: 0;
    }
h1 {
    text-transform: uppercase;
    color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiary};
}

h2 {
    color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiary};
}

table {
    border-collapse: collapse;

    th {
        font-weight: bold;
    }

    td,
    th {
        border: 1px solid ${({ theme }: { theme: ITheme }) =>
					theme.palette.neutralTertiaryAlt};
        padding: 5px;
        text-align: center;
    }
}
`

export function useIconButtonStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				color: theme.palette.neutralPrimaryAlt,
			},
			rootDisabled: {
				backgroundColor: 'none',
			},
		}),
		[theme],
	)
}
