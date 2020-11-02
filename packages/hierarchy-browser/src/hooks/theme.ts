/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useContainerStyle(
	isOpen: boolean,
	entitiesAvailable: boolean,
): React.CSSProperties {
	const theme = useThematic()
	const getTheme = useMemo(
		() =>
			({
				height: isOpen ? (entitiesAvailable ? 250 : 75) : 0,
				border: `1px solid ${theme.application().faint().hex()}`,
			} as React.CSSProperties),
		[isOpen, theme, entitiesAvailable],
	)
	return getTheme
}

export function useThemesStyle(): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: theme.application().lowContrast().hex(),
		}),
		[theme],
	)
}

export function useThemesAccentStyle(isOpen: boolean): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: theme.application().faint().hex(),
			borderColor: theme.application().lowContrast().hex(),
			visible: isOpen ? 'visible' : 'hidden',
		}),
		[theme, isOpen],
	)
}

export function useFilterButtonStyle(): React.CSSProperties {
	return useMemo(
		() => ({
			marginLeft: 5,
		}),
		[],
	)
}
