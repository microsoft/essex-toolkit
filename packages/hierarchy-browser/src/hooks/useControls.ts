/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { IControls } from '../types'

export function useControls(
	controls?: IControls,
): [boolean, boolean, boolean, boolean] {
	const [showLevel, showMembership, showFilter, showExport] = useMemo(() => {
		if (controls) {
			const level = controls.showLevel || true
			const membership = controls.showMembership || true
			const filterData = controls.showFilter || true
			const exportData = controls.showExport || true
			return [level, membership, filterData, exportData]
		}
		return [true, true, true, true]
	}, [controls])
	return [showLevel, showMembership, showFilter, showExport]
}
