/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useMemo, useCallback } from 'react'
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
			settings && settings.isOpen !== undefined ? settings.isOpen : index === 0,
		[settings],
	)
	const visibleColumns = useMemo(() => settings && settings.visibleColumns, [
		settings,
	])
	const minimizeColumns = useMemo(() => settings && settings.minimizeColumns, [
		settings,
	])

	const controls = useMemo(() => settings && settings.controls, [settings])

	const fontStyles = useSettingStyles(settings)

	const getSettings = useCallback(
		(index: number) => {
			const isOpen = getOpenState(index)
			return { isOpen, minimizeColumns, visibleColumns, fontStyles, controls }
		},
		[getOpenState, minimizeColumns, visibleColumns, fontStyles],
	)

	return getSettings
}
