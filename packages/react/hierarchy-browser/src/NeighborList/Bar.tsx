/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ScaleLinear } from 'd3-scale'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

interface ICellComponentProps {
	value: number
	scale: ScaleLinear<number, number>
	color: string
	height: number | string
	width: number
}
export const Bar: React.FC<ICellComponentProps> = memo(function Bar({
	value,
	scale,
	color,
	height,
	width,
}: ICellComponentProps) {
	const size = useMemo(() => scale(value), [scale, value])
	return (
		<>
			<SvgElement width={width} height={height}>
				<rect
					width={size || 10}
					height={height}
					x={width - (size || 0)}
					fill={color}
					rx={1}
					opacity={0.5}
				/>
			</SvgElement>
		</>
	)
})

const SvgElement = styled.svg<{ width: number; height: number | string }>`
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	position: absolute;
	top: 0;
	left: 0;
`
