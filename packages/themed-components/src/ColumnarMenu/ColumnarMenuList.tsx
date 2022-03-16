/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuItem,
	IContextualMenuItemProps,
	IContextualMenuListProps,
} from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import { merge } from 'lodash-es'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export const ColumnarMenuList: React.FC<IContextualMenuListProps> = memo(
	function ColumnarMenuList(props) {
		const theme = useThematicFluent()
		const headerStyle = useMemo(
			() => ({
				color: theme.application().accent().hex(),
			}),
			[theme],
		)

		const { defaultMenuItemRenderer, items } = props
		const formatted: IContextualMenuItem[] = useMemo(() => {
			return items
				.filter(i => !i?.data?.button)
				.map(item =>
					merge({}, item, {
						itemProps,
						sectionProps: item.sectionProps
							? {
									items: item.sectionProps.items.map(subitem =>
										merge({}, subitem, {
											itemProps,
										}),
									),
							  }
							: undefined,
					}),
				)
		}, [items])

		const buttons: IContextualMenuItem[] | undefined = useMemo(() => {
			const _header = items.filter(item => {
				if (item?.data?.button) {
					item.itemProps = itemProps
					return item
				}
				return false
			})
			return _header
		}, [items])

		return (
			<MenuLayout>
				{buttons && buttons.map(b => defaultMenuItemRenderer(b as any))}
				<Options>
					{formatted.map(item => {
						const { key } = item
						return (
							<Column key={`menu-group-${key}`}>
								<ColumnHeader style={headerStyle}>
									{item.sectionProps?.title}
								</ColumnHeader>
								{item.itemType === ContextualMenuItemType.Section ? (
									<>
										{item.sectionProps?.items.map(subitem =>
											defaultMenuItemRenderer(subitem as any),
										)}
									</>
								) : (
									defaultMenuItemRenderer(item as any)
								)}
							</Column>
						)
					})}
				</Options>
			</MenuLayout>
		)
	},
)

const itemProps = {
	styles: {
		root: {
			paddingLeft: 8,
			height: 28,
			lineHeight: 28,
		},
		item: {
			listStyleType: 'none',
		},
		label: {
			overflow: 'hidden',
		},
	},
} as Partial<IContextualMenuItemProps>

const MenuLayout = styled.div`
	padding: 8px 0 8px 0;
	gap: 12px;
`

const Options = styled.div`
	display: flex;
`

const Column = styled.div`
	min-width: 120px;
	max-width: 200px;
`

const ColumnHeader = styled.div`
	padding: 0 12px 0 12px;
	margin-bottom: 8px;
	font-weight: bold;
`
