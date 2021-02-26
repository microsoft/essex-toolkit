/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { ISettings } from '../types'

export function useSettings(
	settings?: ISettings,
): (index: number) => ISettings {
	const getOpenState = useCallback(
		(index: number): boolean =>
			settings?.isOpen !== undefined ? settings.isOpen : index === 0,
		[settings],
	)

	// const fontStyles = useSettingStyles(settings)

	const getSettings = useCallback(
		(index: number): ISettings => {
			const isOpen = getOpenState(index)
			return { isOpen, ...settings }
		},
		[getOpenState, settings],
	)

	return getSettings
}
