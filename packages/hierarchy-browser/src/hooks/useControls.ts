/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { IControls } from '../types'

export function useControls(
	controls?: IControls,
): [boolean, boolean, boolean, boolean] {
	return useMemo(() => {
		let level = true
		let membership = true
		let exportData = true
		let filterData = true
		if (controls) {
			level = controls.showLevel !== undefined ? controls.showLevel : level
			membership =
				controls.showMembership !== undefined
					? controls.showMembership
					: membership
			filterData =
				controls.showFilter !== undefined ? controls.showFilter : filterData
			exportData =
				controls.showExport !== undefined ? controls.showExport : exportData
		}
		return [level, membership, exportData, filterData]
	}, [controls])
}
