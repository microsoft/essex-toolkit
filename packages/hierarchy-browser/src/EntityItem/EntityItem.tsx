/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { IEntityDetail, ITableSettings } from '..'
import { textStyle, tableItems } from '../common/styles'
import { useRowStyle } from './hooks/useRowStyle'

export interface IEntityItemProps {
	item: IEntityDetail
	attrs: string[]
	index: number
	styles?: ITableSettings
}
export const EntityItem: React.FC<IEntityItemProps> = memo(
	({ item, attrs, index, styles }: IEntityItemProps) => {
		const rowStyle = useRowStyle(index)
		const itemStyle = useMemo(
			(): React.CSSProperties => styles?.tableItems || {},
			[styles],
		)
		const itemVariant = useMemo(() => styles?.tableItemsText || tableItems, [
			styles,
		])

		return (
			<TableRow key={`e${index}`} style={rowStyle}>
				<TableItem className={'tableItem'} style={itemStyle}>
					<Text variant={itemVariant} styles={textStyle}>
						{item.id}
					</Text>
				</TableItem>
				{attrs
					? attrs.map((attr, i) => (
							<TableItem
								key={`attr${i}`}
								className={'tableItem'}
								style={itemStyle}
							>
								{item.attrs && item.attrs[attr] ? (
									<Text variant={tableItems} styles={textStyle}>
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
