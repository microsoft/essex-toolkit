/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { ITheme} from '@fluentui/react';
import {useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export const Container = styled.div`
	position: relative;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    
	h1 {
        margin-top: 0;
		text-transform: uppercase;
		color: ${({ theme }: { theme: ITheme}) => theme.palette.neutralTertiary};
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
			border: 1px solid ${({ theme }: { theme: ITheme}) => theme.palette.neutralTertiaryAlt};
			padding: 5px;
			text-align: center;
		}
	}

`

export const Navigation = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`

export function useIconButtonProps(iconName: string, onClick?: any) {
    const theme = useTheme()
    return useMemo(() => {
        return {
            disabled: !onClick,
            styles: {
                root: {
                    color: theme.palette.neutralPrimaryAlt
                },
                rootDisabled: {
                    backgroundColor: 'none',
                }
            },
            iconProps: {
                iconName
            },
            ariaLabel: iconName,
            onClick,
        }
    }, [theme, onClick, iconName])
}