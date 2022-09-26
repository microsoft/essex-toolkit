/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IIconStyles } from '@fluentui/react'

export interface ExpandoProps
	extends React.PropsWithChildren<{
		/* nothing */
	}> {
	label: string
	defaultExpanded?: boolean
	iconStyles?: IIconStyles
	toggleStyles?: React.CSSProperties
}
