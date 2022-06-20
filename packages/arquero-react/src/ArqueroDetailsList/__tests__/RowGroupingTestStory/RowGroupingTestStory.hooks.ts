import { DetailsListFeatures } from '../../types.js'
import { useCallback, useState } from 'react'

export function useToggleTableFeatures(
	features?: Partial<DetailsListFeatures>,
): {
	changeTableFeatures: (feature: string) => void
	tableFeatures: Partial<DetailsListFeatures>
} {
	const [tableFeatures, setTableFeatures] = useState<
		Partial<DetailsListFeatures>
	>(features ?? {})

	const changeTableFeatures = useCallback(
		(propName: string) => {
			const key = propName as keyof DetailsListFeatures
			setTableFeatures({
				...tableFeatures,
				[key]: !tableFeatures[key],
			})
		},
		[tableFeatures, setTableFeatures],
	)

	return {
		changeTableFeatures,
		tableFeatures,
	}
}
