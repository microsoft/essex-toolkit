/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

/**
 * A hook for a toggleable state
 * @param defaultValue The default value for the toggle
 * @returns The current toggle state as well as a function that can be called to toggle the state
 */
export function useToggle(
	defaultValue?: boolean,
): [boolean | undefined, () => void] {
	const [toggled, setToggled] = useState<boolean | undefined>(defaultValue)
	const handler = useCallback(() => {
		setToggled(!toggled)
	}, [toggled])
	return [toggled, handler]
}
