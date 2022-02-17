/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { useCallback } from 'react'

import styled from 'styled-components'
import { EntityId, IEntityDetail, ITableSettings } from '../index.js'
import { textStyle, tableItems } from '../common/styles/index.js'
import { useRowStyle } from './hooks/useRowStyle.js'
const NO_STYLE: React.CSSProperties = Object.freeze({})

export interface IEntityItemProps {
	item: IEntityDetail
	attrs: string[]
	index: number
	selected?: boolean
	styles?: ITableSettings
	onEntityClick: (entiyId: EntityId) => void
}
export const EntityItem: React.FC<IEntityItemProps> = ({
	item,
	attrs,
	index,
	selected,
	styles,
	onEntityClick,
}: IEntityItemProps) => {
	const rowStyle = useRowStyle(index, selected)
	const itemStyle = styles?.tableItems ?? NO_STYLE
	const itemVariant = styles?.tableItemsText ?? tableItems
	const onTableItemClick = useCallback(
		() => onEntityClick(item.id),
		[onEntityClick, item],
	)

	return (
		<TableRow key={`e${index}`} style={rowStyle} onClick={onTableItemClick}>
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
								<Text variant={itemVariant} styles={textStyle}>
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
}

const TableRow = styled.tr``

const TableItem = styled.td`
	cursor: pointer;
`
