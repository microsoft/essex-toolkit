/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { useCallback } from 'react'

import type { CSF } from './types'

const meta = {
	title: 'CollapsiblePanel',
}

export default meta

export const CollapsiblePanelChildrenStory: CSF = () => {
	return (
		<CollapsiblePanel title="Panel">
			<div>This panel has a default title and children</div>
		</CollapsiblePanel>
	)
}

CollapsiblePanelChildrenStory.story = {
	name: 'Just title and children',
}

export const CollapsiblePanelHeaderStory: CSF = () => {
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

export const CollapsiblePanelContainerStory: CSF = () => {
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
