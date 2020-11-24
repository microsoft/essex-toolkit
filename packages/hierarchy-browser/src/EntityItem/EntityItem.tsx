/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import React, { memo } from 'react'
import { IEntityDetail } from '..'
import { textStyle } from '../common/styles'
import { useRowStyle } from './hooks/useRowStyle'
import { ITextProps } from '@fluentui/react'

export interface IEntityItemProps {
	item: IEntityDetail
	attrs: string[]
	index: number
	fontStyle: ITextProps['variant']
}
export const EntityItem: React.FC<IEntityItemProps> = memo(
	({ item, attrs, index, fontStyle }) => {
		const rowStyle = useRowStyle(index)

		return (
			<tr key={`e${index}`} style={rowStyle}>
				<td>
					<Text variant={fontStyle} styles={textStyle}>
						{item.id}
					</Text>
				</td>
				{attrs
					? attrs.map((attr, i) => (
							<td key={`attr${i}`}>
								{item.attrs && item.attrs[attr] ? (
									<Text variant={fontStyle} styles={textStyle}>
										{item.attrs[attr].toLocaleString()}
									</Text>
								) : (
									''
								)}{' '}
							</td>
					  ))
					: null}
			</tr>
		)
	},
)
EntityItem.displayName = 'EntityItem'
