/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useContainerStyle(): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: theme.application().lowContrast().hex(),
		}),
		[theme],
	)
}
