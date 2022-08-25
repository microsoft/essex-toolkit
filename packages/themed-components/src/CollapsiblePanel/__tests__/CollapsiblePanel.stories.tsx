/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { useCallback } from 'react'

const meta = {
	title: '@essex:themed-components/CollapsiblePanel',
}

export default meta

export const CollapsiblePanelChildrenStory = () => {
	return (
		<CollapsiblePanel title="Panel">
			<div>This panel has a default title and children</div>
		</CollapsiblePanel>
	)
}

CollapsiblePanelChildrenStory.story = {
	name: 'Just title and children',
}

export const CollapsiblePanelHeaderStory = () => {
	const renderHeader = useCallback(() => <div>Header</div>, [])
	return (
		<CollapsiblePanel onRenderHeader={renderHeader}>
			<div>This panel has an onRenderHeader function</div>
		</CollapsiblePanel>
	)
}

CollapsiblePanelHeaderStory.story = {
	name: 'Render header function',
}

export const CollapsiblePanelContainerStory = () => {
	return (
		<CollapsiblePanelContainer>
			<CollapsiblePanel title="First">
				<div>First panel</div>
			</CollapsiblePanel>
			<CollapsiblePanel title="Second">
				<div>Second panel</div>
			</CollapsiblePanel>
		</CollapsiblePanelContainer>
	)
}

CollapsiblePanelContainerStory.story = {
	name: 'Container with multiple children',
}

export const CollapsiblePanelStyled = () => {
	return (
		<CollapsiblePanel title="Panel" headerStyles={headerStyles}>
			<div>This panel has a default title and children</div>
		</CollapsiblePanel>
	)
}

const headerStyles = {
	backgroundColor: 'white',
	color: 'black',
	padding: '0.5rem',
	textTransform: 'uppercase',
	fontWeight: 500,
	fontSize: ' 1.5rem',
	display: 'flex',
	alignItems: 'center',
}

CollapsiblePanelStyled.story = {
	name: 'Styled Panel Header',
}
