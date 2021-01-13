/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text, ITextProps } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { IEntityDetail } from '..'
import { textStyle } from '../common/styles'
import { useRowStyle } from './hooks/useRowStyle'

export interface IEntityItemProps {
	item: IEntityDetail
	attrs: string[]
	index: number
	fontStyle: ITextProps['variant']
}
export const EntityItem: React.FC<IEntityItemProps> = memo(
	({ item, attrs, index, fontStyle }: IEntityItemProps) => {
		const rowStyle = useRowStyle(index)

		return (
			<TableRow key={`e${index}`} style={rowStyle}>
				<TableItem>
					<Text variant={fontStyle} styles={textStyle}>
						{item.id}
					</Text>
				</TableItem>
				{attrs
					? attrs.map((attr, i) => (
							<TableItem key={`attr${i}`}>
								{item.attrs && item.attrs[attr] ? (
									<Text variant={fontStyle} styles={textStyle}>
										{item.attrs[attr].toLocaleString()}
									</Text>
								) : (
									''
								)}{' '}
							</TableItem>
					  ))
					: null}
			</TableRow>
		)
	},
)
EntityItem.displayName = 'EntityItem'

const TableRow = styled.tr``

const TableItem = styled.td``
