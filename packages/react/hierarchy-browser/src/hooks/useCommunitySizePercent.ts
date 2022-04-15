/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useCommunitySizePercent(size: number, maxSize: number): number {
	return useMemo(() => size / maxSize, [size, maxSize])
}
