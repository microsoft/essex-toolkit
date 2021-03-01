/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ITextProps, IButtonStyles } from '@fluentui/react'
import React from 'react'
import { ICardOverviewSettings } from '..'
import { headerLabel, subHeaderLabel } from '../common/styles'
import { ITableSettings } from '../types'

const NO_STYLE: React.CSSProperties = Object.freeze({})
const NO_ICON_STYLE: IButtonStyles = Object.freeze({})

export function useOverviewStyles(
	styles?: ICardOverviewSettings,
): [
	//headerVariant
	ITextProps['variant'],
	//subheaderVariant
	ITextProps['variant'],
	//headerStyle
	React.CSSProperties,
	//subheaderStyle
	React.CSSProperties,
	//buttonStyle
	IButtonStyles,
] {
	const buttonStyle = styles?.iconButton ?? NO_ICON_STYLE

	const headerStyle = styles?.header ?? NO_STYLE

	const subheaderStyle = styles?.subheader ?? NO_STYLE

	const headerVariant = styles?.headerText ?? headerLabel
	const subheaderVariant = styles?.subHeaderText ?? subHeaderLabel

	return [
		headerVariant,
		subheaderVariant,
		headerStyle,
		subheaderStyle,
		buttonStyle,
	]
}

export function useTableStyles(
	styles?: ITableSettings,
): [
	//headerVariant
	ITextProps['variant'],
	//subheaderVariant
	ITextProps['variant'],
	//headerStyle
	React.CSSProperties,
	//subheaderStyle
	React.CSSProperties,
	//rootStyle
	React.CSSProperties,
] {
	const headerStyle = styles?.header ?? NO_STYLE

	const subheaderStyle = styles?.subheader ?? NO_STYLE

	const rootStyle = styles?.root ?? NO_STYLE

	const headerVariant = styles?.headerText ?? headerLabel
	const subheaderVariant = styles?.subHeaderText ?? subHeaderLabel

	return [
		headerVariant,
		subheaderVariant,
		headerStyle,
		subheaderStyle,
		rootStyle,
	]
}
