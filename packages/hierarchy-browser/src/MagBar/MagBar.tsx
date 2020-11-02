/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { select } from 'd3-selection'
import React, { useRef, useLayoutEffect, memo } from 'react'

interface IMagBarProps {
	percent: number
	width?: number
	height?: number
}

interface IDataItem {
	x: number
	width: number
}
/**
 * This creates a percent-style bar.
 * It is monotone, using a foreground color for the percent,
 * and a lighter variant for the background.
 */
export const MagBar: React.FC<IMagBarProps> = memo(function MagBar({
	percent,
	width = 100,
	height = 10,
}: IMagBarProps) {
	const theme = useThematic()
	const ref = useRef(null)

	useLayoutEffect(() => {
		const foreground = theme.rect().fill().hex()
		const background = theme.application().faint().hex()
		const border = theme.application().midContrast().hex()
		const data: IDataItem[] = [
			{
				x: 0,
				width: width * percent,
			},
			{
				x: width * percent,
				width: width * (1 - percent),
			},
		]

		select(ref.current).select('svg').remove()

		const g = select(ref.current)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.style('border', `0.5px solid ${border}`)
			.append('g')

		g.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('fill', (d: IDataItem, i: number) =>
				i === 0 ? foreground : background,
			)
			.attr('width', (d: IDataItem) => d.width)
			.attr('height', height)
			.attr('x', (d: IDataItem) => d.x)
	}, [theme, percent, width, height])

	return <div ref={ref} />
})
