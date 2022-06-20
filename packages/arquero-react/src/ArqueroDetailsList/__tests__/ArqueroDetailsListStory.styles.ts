/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownStyles } from '@fluentui/react'
import styled from 'styled-components'

export const BlockContainer = styled.div`
	display: flex;
`

export const ControlBlock = styled.div`
	display: inline;
	gap: 8px;
	padding: 10px;
`
export const Control = styled.div`
	width: 200px;
`

export const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { marginTop: '4px' },
}
