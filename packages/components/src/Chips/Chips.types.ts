/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles, IIconStyles } from '@fluentui/react'

export interface Chip {
	key: string
	text?: string
	iconName?: string
	canClose?: boolean
}

export interface ChipsStyles {
	root?: React.CSSProperties
	item?: React.CSSProperties
	icon?: IIconStyles
	close?: IButtonStyles
}

export interface ChipsProps {
	items: Chip[]
	onClick?: (key: string) => void
	onClose?: (key: string) => void
	styles?: ChipsStyles
}
