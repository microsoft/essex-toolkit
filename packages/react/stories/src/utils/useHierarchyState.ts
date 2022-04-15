/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ISettings } from '@essex/hierarchy-browser'
import type { IChoiceGroupOption } from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'

import { customStyle, selectedClusterID, visibleColumns } from './utils.js'

export function useHierarchyState(): [
	string,
	(option: IChoiceGroupOption) => void,
	boolean | undefined,
	(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) => void,
	(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) => void,
	boolean | undefined,
	ISettings,
] {
	const [selectedOption, setSelectedOption] = useState<string>(
		`${selectedClusterID}`,
	)

	const [loadState, setLoadState] = useState<boolean | undefined>(false)

	const [showCustomStyles, setCustomStyles] = useState<boolean | undefined>(
		false,
	)

	const onChange = useCallback(
		(option: IChoiceGroupOption) => setSelectedOption(option.key),
		[setSelectedOption],
	)

	const handleStyleChange = useCallback(
		(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) =>
			setCustomStyles(checked),
		[setCustomStyles],
	)

	const handleNeighborsLoaded = useCallback(
		(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) =>
			setLoadState(checked),
		[setLoadState],
	)

	const settings = useMemo(() => {
		const styles = showCustomStyles ? customStyle : {}
		return {
			visibleColumns,
			controls: { showFilter: false },
			styles,
		} as ISettings
	}, [showCustomStyles])

	return [
		selectedOption,
		onChange,
		loadState,
		handleNeighborsLoaded,
		handleStyleChange,
		showCustomStyles,
		settings,
	]
}
