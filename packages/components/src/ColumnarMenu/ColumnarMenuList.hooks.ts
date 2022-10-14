/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuItem,
	IContextualMenuItemStyles,
} from '@fluentui/react'
import { merge } from 'lodash-es'
import { useMemo } from 'react'
/**
 * Prepares the primary menu items for columnar rendering
 * @param items
 * @returns
 */
export function useFormattedItems(
	items: IContextualMenuItem[],
	styles?: IContextualMenuItemStyles,
): IContextualMenuItem[] {
	return useMemo(() => {
		return items
			.filter(i => !i?.data?.button)
			.map(item =>
				merge({}, item, {
					itemProps: { styles },
					sectionProps: item.sectionProps
						? {
								items: item.sectionProps.items.map(subitem =>
									merge({}, subitem, {
										itemProps: { styles },
									}),
								),
						  }
						: undefined,
				}),
			)
	}, [items, styles])
}

/**
 * Extracts the button-tagged items for rendering at the top.
 */
export function useButtonItems(
	items: IContextualMenuItem[],
	styles?: IContextualMenuItemStyles,
): IContextualMenuItem[] | undefined {
	return useMemo(() => {
		return items.filter(item => {
			if (item?.data?.button) {
				item.itemProps = { styles }
				return item
			}
			return false
		})
	}, [items, styles])
}
