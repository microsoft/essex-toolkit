/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITextFieldProps } from '@fluentui/react'
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import { useBaseStyles } from './ReadOnlyTextField.styles.js'

/**
 * This is a standard TextField, with default styles overridden
 * to provide some consistent "read only look" that visually
 * indicates the field can't be edited without looking fully disabled.
 */
export const ReadOnlyTextField: React.FC<ITextFieldProps> = memo(
	function ReadOnlyTextField({ styles, ...props }) {
		const baseStyles = useBaseStyles(styles)
		return <TextField readOnly styles={baseStyles} {...props} />
	},
)
