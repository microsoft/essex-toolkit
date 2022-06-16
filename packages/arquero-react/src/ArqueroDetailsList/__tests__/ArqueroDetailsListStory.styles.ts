/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownStyles } from '@fluentui/react'
import styled from 'styled-components'

export const ControlBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding-top: 10px;
	padding-bottom: 10px;
`
export const Control = styled.div`
	width: 200px;
`

export const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { marginTop: '4px' },
}
