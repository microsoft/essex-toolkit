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
 * Renders the callout attatched to the targetId, with a TextField autofocused
 * @param {string} name - The original string to be edited.
 * @param {string} targetId - The id of the component for the callout to be attatched
 * @param {function} onSend - The callback receiving the new name or the old one if the action was cancelled
 * @returns the callout element
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
