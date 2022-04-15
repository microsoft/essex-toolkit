/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState, ThemeVariant } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useRowStyle(
	index: number,
	selected?: boolean,
): React.CSSProperties {
	const theme = useThematic()
	const backgroundColor = useMemo((): string => {
		let backgroundColor =
			index % 2 === 0 ? theme.application().faint().hex() : 'transparent'
		if (selected) {
			const alpha = theme.config.variant === ThemeVariant.Dark ? 0.4 : 0.2
			const [r, g, b, a] = theme
				.rect({ selectionState: SelectionState.Selected })
				.fill()
				.rgbav(alpha)

			backgroundColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`
		}
		return backgroundColor
	}, [selected, theme, index])
	return useMemo(
		(): React.CSSProperties => ({
			backgroundColor,
		}),
		[backgroundColor],
	)
}
