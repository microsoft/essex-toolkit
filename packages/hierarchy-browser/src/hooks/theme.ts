/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ITextProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { useMemo } from 'react'
import {
	headerLabel,
	rowHeader,
	subHeaderLabel,
	tableItems,
} from '../common/styles'
import { ISettings } from '../types'

export function useContainerStyle(isOpen: boolean): React.CSSProperties {
	const theme = useThematic()
	const getTheme = useMemo(
		() =>
			({
				height: isOpen ? 250 : 0,
				width: isOpen ? '100%' : '0px',
				border: `1px solid ${theme.application().faint().hex()}`,
				flex: isOpen ? 1 : 'revert',
				WebkitFlex: isOpen ? 1 : 'revert',
			} as React.CSSProperties),
		[isOpen, theme],
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
			width: isOpen ? '15px' : 0,
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
