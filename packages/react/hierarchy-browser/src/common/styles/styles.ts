/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITextProps } from '@fluentui/react'

const tiny = 'tiny' as ITextProps['variant']
const xSmall = 'xSmall' as ITextProps['variant']
const small = 'small' as ITextProps['variant']
const smallPlus = 'smallPlus' as ITextProps['variant']
const medium = 'medium' as ITextProps['variant']
const mediumPlus = 'mediumPlus' as ITextProps['variant']
const large = 'large' as ITextProps['variant']
const xLarge = 'xLarge' as ITextProps['variant']
const xxLarge = 'xxLarge' as ITextProps['variant']
const mega = 'mega' as ITextProps['variant']

export const variants = {
	tiny,
	xSmall,
	small,
	smallPlus,
	medium,
	mediumPlus,
	large,
	xLarge,
	xxLarge,
	mega,
}

export const rowHeader = variants.large
export const rowSubHeader = variants.mediumPlus
export const headerLabel = variants.large
export const subHeaderLabel = variants.mediumPlus

export const tableItems = variants.medium
export const paddingLeft = 10

export const textStyle = { root: { marginLeft: paddingLeft } }
