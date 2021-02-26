/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IChoiceGroupOption } from '@fluentui/react'
import React, { useCallback, useState } from 'react'
import { CSF } from './types'
import { ControlGroup, Selections } from './utils/components'
import { useData } from './utils/useData'
import { options, selectedClusterID, visibleColumns } from './utils/utils'
import { HierarchyBrowser } from '@essex-js-toolkit/hierarchy-browser'
import { useAsyncCallbacks } from './utils/useAsyncCallbacks'
import { useStaticEntities } from './utils/useStaticEntities'
import { useHierarchyState } from './utils/useHierarchyState'

const story = {
	title: 'HierarchyBrowser',
}

export default story

export const HierarchyBrowserAsync: CSF = () => {
	const [
		selectedOption,
		onChange,
		loadState,
		handleNeighborsLoaded,
		handleStyleChange,
		showCustomStyles,
		settings,
	] = useHierarchyState()

	const [communities, nodes, edges, searchForChildren] = useData(selectedOption)

	const [getEntities, getNeighbors] = useAsyncCallbacks({
		nodes,
		edges,
		loadState,
		searchForChildren,
	})
	return (
		<>
			<ControlGroup
				loadState={loadState}
				defaultSelectedKey={selectedClusterID}
				onChange={onChange}
				options={options}
				handleNeighborsLoaded={handleNeighborsLoaded}
				showCustomStyles={showCustomStyles}
				onStyleChange={handleStyleChange}
			/>
			{communities && (
				<HierarchyBrowser
					communities={communities}
					entities={getEntities as any}
					neighbors={getNeighbors as any}
					settings={settings}
				/>
			)}
		</>
	)
}

HierarchyBrowserAsync.story = {
	name: 'Async',
}

export const HierarchyBrowserSynchronous: CSF = () => {
	const [selectedOption, setSelectedOption] = useState<string>(
		`${selectedClusterID}`,
	)

	const onChange = useCallback(
		(option: IChoiceGroupOption) => setSelectedOption(option.key),
		[setSelectedOption],
	)

	const [communities, nodes, edges, searchForChildren] = useData(selectedOption)

	const [neighborData, allEntities] = useStaticEntities({
		communities,
		nodes,
		edges,
		searchForChildren,
	})

	return (
		<>
			<Selections
				options={options}
				defaultSelectedKey={`${selectedClusterID}`}
				label={'selected community'}
				onChange={onChange}
			/>
			{communities && (
				<HierarchyBrowser
					communities={communities}
					entities={allEntities}
					neighbors={neighborData}
					settings={{ visibleColumns }}
				/>
			)}
		</>
	)
}

HierarchyBrowserSynchronous.story = {
	name: 'Synchronous',
}
