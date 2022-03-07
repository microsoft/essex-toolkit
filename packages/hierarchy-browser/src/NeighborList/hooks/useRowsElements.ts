/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import type { Theme } from '@thematic/core'
import { SelectionState, ThemeVariant } from '@thematic/core'
import type { ScaleLinear } from 'd3-scale'
import { scaleLinear } from 'd3-scale'
import { useCallback, useMemo } from 'react'
import type { INeighborCommunityDetail } from '../../index.js'
import { useMaxEdges } from './useMaxEdges.js'

export interface IMeasurements {
	size: number
	connections: number
}
export function useRowElements(
	theme: Theme,
	selectedEdge?: INeighborCommunityDetail,
	edges?: INeighborCommunityDetail[],
	dimensions?: Dimensions,
): [
	(edge: INeighborCommunityDetail, rowIndex: number) => React.CSSProperties,
	// barColor
	string,
	//connScale
	ScaleLinear<number, number>,
	//sizeScale
	ScaleLinear<number, number>,
] {
	const [maxConnections, maxSize] = useMaxEdges(edges)
	const barColor = useMemo(
		(): string =>
			theme.rect({ selectionState: SelectionState.Selected }).fill().hex(),
		[theme],
	)

	const [connScale, sizeScale] = useMemo(() => {
		const width = dimensions ? dimensions.width : 10
		const connectionScale = scaleLinear()
			.domain([0, maxConnections || 10])
			.range([0, width])
		const childScale = scaleLinear()
			.domain([0, maxSize || 10])
			.range([0, width])
		return [connectionScale, childScale]
	}, [maxSize, maxConnections, dimensions])

	const getBackgroundStyle = useCallback(
		(edge: INeighborCommunityDetail, rowIndex: number): React.CSSProperties => {
			let backgroundColor =
				rowIndex % 2 === 0 ? theme.application().faint().hex() : 'transparent'
			const selected =
				selectedEdge && edge.communityId === selectedEdge.communityId
			if (selected) {
				const alpha = theme.config.variant === ThemeVariant.Dark ? 0.4 : 0.2

				const [r, g, b, a] = theme
					.rect({ selectionState: SelectionState.Selected })
					.fill()
					.rgbav(alpha)
				backgroundColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`
			}

			return {
				backgroundColor,
			}
		},
		[theme, selectedEdge],
	)

	return [getBackgroundStyle, barColor, connScale, sizeScale]
}
