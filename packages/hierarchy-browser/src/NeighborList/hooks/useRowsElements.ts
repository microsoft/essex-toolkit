/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState, Theme } from '@thematic/core'
import { useCallback } from 'react'
import { INeighborCommunityDetail } from '../..'
import { IColorRGB } from '../../utils/utils'
import { useMaxEdges } from './useMaxEdges'

export interface IMeasurements {
	size: number
	connections: number
}
const DEFAULT_COLOR = 'DEFAULT_COLOR'
export function useRowElements(
	theme: Theme,
	selectedEdge?: INeighborCommunityDetail,
	edges?: INeighborCommunityDetail[],
): [
	//getBackgroundColor
	(color: IColorRGB | null, percent: number) => string,
	//getMeasurements
	(edge: INeighborCommunityDetail) => IMeasurements,
	//getBackgroundStyle
	(edge: INeighborCommunityDetail, index: number) => React.CSSProperties,
] {
	const [maxConnections, maxSize] = useMaxEdges(edges)

	// const getBackgroundStyle = useCallback(
	// 	(edge: INeighborCommunityDetail): string => {
	// 		return selectedEdge && edge.communityId === selectedEdge.communityId
	// 			? theme.application().lowContrast().hex()
	// 			: theme.application().background().hex()
	// 	},
	// 	[selectedEdge, theme],
	// )

	const getMeasurements = useCallback(
		(edge: INeighborCommunityDetail): IMeasurements => {
			const connectionPercent = maxConnections
				? 100 * (edge.connections / maxConnections)
				: 0
			const sizePercent = maxSize ? 100 * (edge.size / maxSize) : 0
			const measurements = { size: sizePercent, connections: connectionPercent }
			return measurements
		},
		[maxSize, maxConnections],
	)

	const getBackgroundColor = useCallback(
		(color: IColorRGB | null, percent: number): string => {
			const barColor =
				color !== null
					? `rgba(${color.r}, ${color.b}, ${color.g}, 0.5)`
					: DEFAULT_COLOR
			const themeBackground = theme.application().background().hex()

			return `linear-gradient(to right,
				${barColor} ${percent}%, ${percent}%, ${themeBackground} ${100 - percent}%)`
		},
		[theme],
	)

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
		(edge: INeighborCommunityDetail, index: number): React.CSSProperties => {
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
				} as React.CSSProperties
			} else {
				const borderColor = theme.application().faint().hex()
				return {
					borderColor,
					borderWidth: '0px 0px 1px 0px',
				}
			}
		},
		[theme, selectedEdge],
	)

	return [getBackgroundColor, getMeasurements, getBackgroundStyle]
}
