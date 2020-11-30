/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo, useCallback } from 'react'
import { IControls, ISettings } from '../types'
import { ICardFontStyles, useSettingStyles } from './theme'

export interface ISettingState {
	isOpen: boolean
	fontStyles: ICardFontStyles
	minimizeColumns?: boolean
	visibleColumns?: string[]
	controls?: IControls
}
export function useSettings(
	settings?: ISettings,
): (index: number) => ISettingState {
	const getOpenState = useCallback(
		(index: number): boolean =>
			settings?.isOpen !== undefined ? settings.isOpen : index === 0,
		[settings],
	)
	const visibleColumns = useMemo(() => settings?.visibleColumns, [settings])
	const minimizeColumns = useMemo(() => settings?.minimizeColumns, [settings])

	const controls = useMemo(() => settings?.controls, [settings])

	const fontStyles = useSettingStyles(settings)

	const getSettings = useCallback(
		(index: number): ISettingState => {
			const isOpen = getOpenState(index)
			return { isOpen, minimizeColumns, visibleColumns, fontStyles, controls }
		},
		[getOpenState, minimizeColumns, visibleColumns, fontStyles, controls],
	)

	return getSettings
}
