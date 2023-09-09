/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	createBarGroup,
	generate,
	markState,
	selectAll,
	selectBarGroup,
} from './SparkBar.utils.js'
import type { GroupedTerm, SparkbarProps } from './TimeBrush.types.js'
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import {
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

const DEFAULT_BAR_WIDTH = 8
const DEFAULT_BAR_GAP = 1

export const Sparkbar: React.FC<SparkbarProps> = memo(function Sparkbar({
	data,
	width,
	height,
	barWidth = DEFAULT_BAR_WIDTH,
	barGap = DEFAULT_BAR_GAP,
	id,
	value,
	nodata,
	selected,
	onClick,
	xScale,
	marked,
}) {
	const theme = useThematic()
	const ref = useRef(null)
	const nodataFn = useCallback(
		(d: unknown) => {
			if (nodata) {
				return nodata(d)
			}
			return false
		},
		[nodata],
	)
	const [hovered, setHovered] = useState<any>(null)
	const handleHover = useCallback((d: any) => setHovered(d), [])
	const [barGroup, setBarGroup] = useState<any>()

	useLayoutEffect(() => {
		setBarGroup(createBarGroup(ref, theme, width, height))
	}, [theme, data, width, height])

	useLayoutEffect(() => {
		generate(
			barGroup,
			data as GroupedTerm[],
			nodataFn,
			value,
			height,
			xScale,
			barWidth,
			barGap,
			theme,
		)
	}, [
		theme,
		data,
		barGroup,
		width,
		height,
		barWidth,
		barGap,
		value,
		nodataFn,
		xScale,
	])

	useLayoutEffect(() => {
		selectBarGroup(barGroup, handleHover, onClick)
	}, [data, barGroup, id, onClick, handleHover])

	useLayoutEffect(() => {
		selectAll(barGroup, onClick)
	}, [data, barGroup, onClick])

	// generate a complimentary highlight
	const highlight = useMemo(() => theme.scales().nominal(10)(1).hex(), [theme])

	useLayoutEffect(() => {
		const getSelectionState = (d: any) => {
			if (nodataFn(d)) {
				return SelectionState.NoData
			}
			if (d === hovered) {
				return SelectionState.Hovered
			}
			const sel = selected ? selected(d) : false
			if (sel) {
				return SelectionState.Selected
			}
			return SelectionState.Normal
		}
		markState(barGroup, getSelectionState, marked, highlight, theme)
	}, [
		theme,
		data,
		barGroup,
		highlight,
		nodataFn,
		id,
		hovered,
		selected,
		marked,
	])

	// force width of container to exactly match the svg
	const divStyle = useMemo(() => ({ width, height }), [width, height])

	return <div ref={ref} style={divStyle} />
})
