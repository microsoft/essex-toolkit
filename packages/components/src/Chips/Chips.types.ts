/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles, IIconStyles } from '@fluentui/react'

export interface ChipItem {
	key: string
	text?: string
	iconName?: string
	canClose?: boolean
}

export interface ChipStyles {
	root?: React.CSSProperties
	icon?: IIconStyles
	close?: IButtonStyles
}

export interface ChipsStyles {
	root?: React.CSSProperties
	item?: ChipStyles
}

export interface ChipsProps {
	items: ChipItem[]
	onClick?: (key: string) => void
	onClose?: (key: string) => void
	styles?: ChipsStyles
}

export interface ChipItemProps {
	item: ChipItem
	onClick?: () => void
	onClose?: () => void
	styles?: ChipsStyles
}
