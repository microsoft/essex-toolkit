/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownProps } from '@fluentui/react'

export interface EnumDropdownProps<E = unknown>
	extends Omit<IDropdownProps, 'options'> {
	enumeration: E
	/**
	 * Optional labels to map enum keys to alternate text.
	 * This is helpful for when the enum values may not be as user-friendly.
	 */
	labels?: Record<string, string>
}
