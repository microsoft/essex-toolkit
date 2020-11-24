/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { useMemo } from 'react'
import {
	headerLabel,
	rowHeader,
	subHeaderLabel,
	tableItems,
} from '../common/styles'
import { ISettings } from '../types'
import { ITextProps } from '@fluentui/react'

export function useContainerStyle(
	isOpen: boolean,
	entitiesAvailable: boolean,
): React.CSSProperties {
	const theme = useThematic()
	const getTheme = useMemo(
		() =>
			({
				height: isOpen ? (entitiesAvailable ? 250 : 75) : 0,
				border: `1px solid ${theme.application().faint().hex()}`,
			} as React.CSSProperties),
		[isOpen, theme, entitiesAvailable],
	)
	return getTheme
}

export function useThemesStyle(): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: theme.application().lowContrast().hex(),
		}),
		[theme],
	)
}

export function useThemesAccentStyle(isOpen: boolean): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: theme.application().faint().hex(),
			borderColor: theme.application().lowContrast().hex(),
			visible: isOpen ? 'visible' : 'hidden',
		}),
		[theme, isOpen],
	)
}

export function useFilterButtonStyle(): React.CSSProperties {
	return useMemo(
		() => ({
			marginLeft: 5,
		}),
		[],
	)
}
export interface ICardFontStyles {
	cardOverviewHeader: ITextProps['variant']
	cardOverviewSubheader: ITextProps['variant']
	tableHeader: ITextProps['variant']
	tableSubheader: ITextProps['variant']
	tableItem: ITextProps['variant']
}
export function useSettingStyles(settings?: ISettings): ICardFontStyles {
	return useMemo(() => {
		let cardOverviewHeader = headerLabel
		let cardOverviewSubheader = subHeaderLabel
		let tableHeader = rowHeader
		let tableSubheader = subHeaderLabel
		let tableItem = tableItems
		if (settings && settings.styles) {
			if (settings.styles.cardOverview) {
				cardOverviewHeader =
					settings.styles.cardOverview.header || cardOverviewHeader
				cardOverviewSubheader =
					settings.styles.cardOverview.subheader || cardOverviewSubheader
			}
			if (settings.styles.table) {
				tableHeader = settings.styles.table.header || tableHeader
				tableSubheader = settings.styles.table.subheader || tableSubheader
				tableItem = settings.styles.table.tableItems || tableItem
			}
		}
		return {
			cardOverviewHeader,
			cardOverviewSubheader,
			tableHeader,
			tableSubheader,
			tableItem,
		}
	}, [settings])
}
