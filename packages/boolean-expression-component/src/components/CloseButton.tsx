/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback } from 'react'
import { Icon, mergeStyles } from '@fluentui/react'

export const CloseButton: React.FC<{
	onClick(): void
	color?: string
}> = memo(function CloseButton({ onClick, color = 'white' }) {
	const handleClick = useCallback(() => onClick(), [onClick])
	const iconClass = mergeStyles({
		fontSize: 10,
		height: 10,
		width: 10,
		marginLeft: '10px',
		color: color,
		cursor: 'pointer',
	})

	return (
		<Icon
			iconName={'Clear'}
			onClick={handleClick}
			className={iconClass}
			color={color}
		/>
	)
})
