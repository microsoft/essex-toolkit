/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles } from '@fluentui/react'

export const defaultButtonStyles: IButtonStyles = {
	root: {
		width: '100%',
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	textContainer: {
		overflow: 'hidden',
	},
	label: {
		fontWeight: 'normal',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
	},
}
