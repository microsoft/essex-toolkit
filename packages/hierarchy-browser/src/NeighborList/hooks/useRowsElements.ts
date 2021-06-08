/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dimensions } from '@essex-js-toolkit/hooks'
import { SelectionState, Theme } from '@thematic/core'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { useCallback, useMemo } from 'react'
import { INeighborCommunityDetail } from '../..'
import { useMaxEdges } from './useMaxEdges'

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
	(
		edge: INeighborCommunityDetail,
		index: number,
		rowIndex: number,
	) => React.CSSProperties,
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

	function getBorderWidth(index: number): string {
		switch (index) {
			case 0:
				return '1px 0px 1px 1px'
			case 1:
				return '1px 0px 1px 0px'
			case 2:
				return '1px 0px 1px 1px'
			default:
				return '1px 0px 1px 0px'
		}
	}

	const getBackgroundStyle = useCallback(
		(
			edge: INeighborCommunityDetail,
			index: number,
			rowIndex: number,
		): React.CSSProperties => {
			const backgroundColor =
				rowIndex % 2 === 0 ? theme.application().faint().hex() : 'transparent'
			const selected =
				selectedEdge && edge.communityId === selectedEdge.communityId
			if (selected) {
				const borderColor = theme
					.rect({ selectionState: SelectionState.Selected })
					.fill()
					.hex()
				const borderWidth = getBorderWidth(index)

				return {
					borderColor,
					borderWidth,
					backgroundColor,
				} as React.CSSProperties
			} else {
				const borderColor = theme.application().faint().hex()
				return {
					borderColor,
					borderWidth: '0px 0px 1px 0px',
					backgroundColor,
				}
			}
		},
		[theme, selectedEdge],
	)

	return [getBackgroundStyle, barColor, connScale, sizeScale]
}
