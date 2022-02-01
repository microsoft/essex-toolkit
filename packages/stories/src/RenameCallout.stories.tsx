/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RenameCallout } from '@essex-js-toolkit/themed-components'
import { PrimaryButton } from '@fluentui/react'
import { useCallback } from '@storybook/addons'
import { useState } from 'react'
import { CSF } from './types'

const story = {
	title: 'RenameCallout',
}
export default story

const buttonStyle = {
	marginLeft: '8px',
}

export const RenameCalloutStory: CSF = () => {
	const [title, setTitle] = useState('Title')
	const [isEditing, setEditing] = useState(false)

	const onSend = useCallback(
		(name?: string) => {
			if (name) {
				setTitle(name)
			}
			setEditing(false)
		},
		[setTitle, setEditing],
	)

	const onEdit = useCallback(() => {
		setEditing(true)
	}, [setEditing])

	return (
		<div>
			<span id="title">{title}</span>
			<PrimaryButton style={buttonStyle} onClick={onEdit}>
				Edit
			</PrimaryButton>

			{isEditing && (
				<RenameCallout targetId="title" name={title} onSend={onSend} />
			)}
		</div>
	)
}

RenameCalloutStory.story = {
	name: 'Rename',
}
