/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DirectionalHint,
	FocusTrapCallout,
	ICalloutProps,
	TextField,
} from '@fluentui/react'
import * as React from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

interface RenameCalloutProps extends ICalloutProps {
	onSend: (name?: string) => void
	name: string
	targetId: string
}

/**
 * Renders the callout with a field to rename the table (and autofocus to the input)
 */
export const RenameCallout: React.FC<RenameCalloutProps> = memo(
	function RenameCallout({ onSend, name, targetId, ...props }) {
		const [editedName, setEditedName] = useState(name)

		const onChange = useCallback(
			(_: unknown, val?: string) => {
				setEditedName(val || '')
			},
			[setEditedName],
		)

		const validateKeyEvent = useCallback(
			(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				if (e.key === 'Enter') return onSend(editedName)
				if (e.key === 'Escape') {
					onSend(name)
				}
			},
			[onSend, name, editedName],
		)

		return (
			<FocusCallout
				target={`#${targetId}`}
				directionalHint={DirectionalHint.topCenter}
				{...props}
			>
				<TextField
					value={editedName}
					onKeyDown={validateKeyEvent}
					onChange={onChange}
					underlined
				/>
			</FocusCallout>
		)
	},
)

const FocusCallout = styled(FocusTrapCallout)`
	width: 320;
	max-width: 90%;
	padding: 10px;
`
