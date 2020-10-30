/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { useMemo } from 'react'

export function useRowStyle(index: number): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			backgroundColor:
				index % 2 === 0 ? theme.application().faint().hex() : 'transparent',
		}),
		[index, theme],
	)
}
