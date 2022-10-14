/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EntityId } from '@essex/hierarchy-browser'
import { HierarchyBrowser } from '@essex/hierarchy-browser'
import type { IChoiceGroupOption } from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'

import { ControlGroup, Selections } from './utils/components/index.js'
import { useAsyncCallbacks } from './utils/useAsyncCallbacks.js'
import { useData } from './utils/useData.js'
import { useHierarchyState } from './utils/useHierarchyState.js'
import { useStaticEntities } from './utils/useStaticEntities.js'
import { options, selectedClusterID, visibleColumns } from './utils/utils.js'

const story = {
	title: '@essex:hierarchy-browser/HierarchyBrowser',
}

export default story
const DEFAULT_SELECTIONS = ['4_100']

export const HierarchyBrowserAsync = () => {
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
	const [selectionState, setSelectionState] =
		useState<EntityId[]>(DEFAULT_SELECTIONS)

	const [getEntities, getNeighbors] = useAsyncCallbacks({
		nodes,
		edges,
		loadState,
		searchForChildren,
	})

	const HB = useMemo(() => {
		if (communities) {
			return (
				<HierarchyBrowser
					communities={communities}
					entities={getEntities as any}
					neighbors={getNeighbors as any}
					settings={settings}
					selections={selectionState}
					onSelectionChange={setSelectionState}
				/>
			)
		}
		return null
	}, [communities, getEntities, getNeighbors, settings, selectionState])
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
			{HB}
		</>
	)
}

HierarchyBrowserAsync.storyName = 'Async'

export const HierarchyBrowserSynchronous = () => {
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

HierarchyBrowserSynchronous.storyName = 'Synchronous'
