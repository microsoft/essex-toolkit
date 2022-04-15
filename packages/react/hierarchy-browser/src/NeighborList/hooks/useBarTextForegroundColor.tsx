/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useBarTextForegroundColor(): string {
	const theme = useThematic()
	return useMemo(() => theme.text().fill().hex(), [theme])
}
