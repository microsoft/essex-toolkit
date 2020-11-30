/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { IControls } from '../types'
interface IControlSettings {
	showLevel: boolean
	showMembership: boolean
	showFilter: boolean
	showExport: boolean
}
export function useControls(controls?: IControls): IControlSettings {
	return useMemo(() => {
		let showLevel = true
		let showMembership = true
		let showExport = true
		let showFilter = true
		if (controls) {
			showLevel = controls.showLevel != null ? controls.showLevel : showLevel
			showMembership =
				controls.showMembership != null
					? controls.showMembership
					: showMembership
			showFilter =
				controls.showFilter != null ? controls.showFilter : showFilter
			showExport =
				controls.showExport != null ? controls.showExport : showExport
		}
		return { showLevel, showMembership, showExport, showFilter }
	}, [controls])
}
