/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ScaleLinear } from 'd3-scale'
import React, { memo } from 'react'

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
	const size = scale(value)
	return (
		<>
			<svg
				width={width}
				height={height}
				style={{ position: 'absolute', top: 0, left: 0 }}
			>
				<rect
					width={size || 10}
					height={height}
					x={width - (size || 0)}
					fill={color}
					rx={3}
					opacity={0.5}
				/>
			</svg>
		</>
	)
})
