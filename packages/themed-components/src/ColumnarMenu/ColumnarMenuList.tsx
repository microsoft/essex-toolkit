/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuItem,
	IContextualMenuItemProps,
	IContextualMenuListProps,
} from '@fluentui/react'
import { ContextualMenuItemType, Separator } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import { merge } from 'lodash-es'
import { memo, useCallback, useMemo } from 'react'

export const ColumnarMenuList: React.FC<IContextualMenuListProps> = memo(
	function ColumnarMenuList(props) {
		const theme = useThematicFluent()
		const headerStyle = useMemo(
			() => ({
				color: theme.application().accent().hex(),
				padding: '0 12px 0 12px',
				marginBottom: '8',
				fontWeight: 700,
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

		const verifySeparator = useCallback(
			(show?: boolean) => show && <Separator />,
			[],
		)

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
			<div style={styles.menu}>
				{buttons &&
					buttons.map(b => (
						<>
							{verifySeparator(b.data?.topDivider)}
							{defaultMenuItemRenderer(b as any)}
							{verifySeparator(b.data?.bottomDivider)}
						</>
					))}
				<div style={styles.options}>
					{formatted.map(item => {
						const { key } = item
						return (
							<div style={styles.column} key={`menu-group-${key}`}>
								<div style={headerStyle}>{item.sectionProps?.title}</div>
								{item.itemType === ContextualMenuItemType.Section ? (
									<>
										{verifySeparator(item.sectionProps?.topDivider)}
										{item.sectionProps?.items.map(subitem =>
											defaultMenuItemRenderer(subitem as any),
										)}
										{verifySeparator(item.sectionProps?.bottomDivider)}
									</>
								) : (
									<>
										{verifySeparator(item.data?.topDivider)}
										{defaultMenuItemRenderer(item as any)}
										{verifySeparator(item.data?.bottomDivider)}
									</>
								)}
							</div>
						)
					})}
				</div>
			</div>
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
	},
} as Partial<IContextualMenuItemProps>

const styles = {
	menu: {
		padding: '8px 0 8px 0',
		gap: '12px',
	},
	options: {
		display: 'flex',
	},
	column: {
		minWidth: 120,
	},
}
