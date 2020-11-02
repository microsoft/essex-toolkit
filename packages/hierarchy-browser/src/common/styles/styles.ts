/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ITextProps } from '@fluentui/react'

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

export const rowHeader = variants.large as ITextProps['variant']
export const rowSubHeader = variants.mediumPlus as ITextProps['variant']
export const headerLabel = variants.large as ITextProps['variant']
export const subHeaderLabel = variants.mediumPlus as ITextProps['variant']

export const tableItems = variants.medium as ITextProps['variant']
export const paddingLeft = 10

export const textStyle = { root: { marginLeft: paddingLeft } }
