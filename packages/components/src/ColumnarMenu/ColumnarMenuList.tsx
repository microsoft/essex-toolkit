/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenuItemType, Separator } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { ColumnarMenuListProps } from './ColumnarMenu.types.js'
import { useButtonItems, useFormattedItems } from './ColumnarMenuList.hooks.js'
import { useStyles } from './ColumnarMenuList.styles.js'

/**
 * This component replaces the default ContextualMenuList rendering with
 * a columnar layout of the sections instead of vertical stacks.
 * Note that items should be sorted into sections with sectionProps,
 * though options buttons do not need to be in a section and will all be coalesced at the top.
 */
export const ColumnarMenuList: React.FC<ColumnarMenuListProps> = memo(
	function ColumnarMenuList(props) {
		const { items, defaultMenuItemRenderer } = props

		const styles = useStyles(props.styles)

		const formatted = useFormattedItems(items, styles.item)
		const buttons = useButtonItems(items, styles.item)

		const verifySeparator = useCallback(
			(show?: boolean) => show && <Separator />,
			[],
		)

		return (
			<div style={styles.menu}>
				{buttons?.map((b) => (
					<>
						{verifySeparator(b.data?.topDivider)}
						{defaultMenuItemRenderer(b as any)}
						{verifySeparator(b.data?.bottomDivider)}
					</>
				))}
				<div style={styles.options}>
					{formatted.map((item) => {
						const { key } = item
						return (
							<div style={styles.column} key={`menu-group-${key}`}>
								<div style={styles.header}>{item.sectionProps?.title as string}</div>
								{item.itemType === ContextualMenuItemType.Section ? (
									<>
										{verifySeparator(item.sectionProps?.topDivider)}
										{item.sectionProps?.items.map((subitem) =>
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
