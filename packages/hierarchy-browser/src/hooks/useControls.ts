import { useMemo } from 'react'
import { IControls } from '../types'

export function useControls(controls?: IControls) {
	const [showLevel, showMembership, showFilter, showExport] = useMemo(() => {
		if (controls) {
			const level = controls.showLevel !== undefined ? controls.showLevel : true
			const membership =
				controls.showMembership !== undefined ? controls.showMembership : true
			const filterData =
				controls.showFilter !== undefined ? controls.showFilter : true
			const exportData =
				controls.showExport !== undefined ? controls.showExport : true
			return [level, membership, filterData, exportData]
		}
		return [true, true, true, true]
	}, [controls])
	return [showLevel, showMembership, showFilter, showExport]
}
