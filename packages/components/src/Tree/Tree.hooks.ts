/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo, useState } from 'react'

import type { TreeGroup, TreeItem } from './Tree.types.js'

export interface TreeItemGroup extends TreeGroup {
	items: TreeItem[]
}

interface Expansion {
	is: (key: string) => boolean
	on: (key: string) => void
}
export function useExpansion(items: TreeItem[], selectedKey?: string): Expansion {
	const defaultExpansion = useMemo(() => forceExpansionToSelected(items, selectedKey), [items, selectedKey])
	const [expandMap, setExpandMap] = useState<Record<string, boolean>>(defaultExpansion)
	return useMemo(
		() => ({
			is: (key: string) => expandMap[key],
			on: (key: string) => 
				setExpandMap((prev) => ({
					...prev,
					[key]: !prev[key],
				})),
		}),
		[expandMap, setExpandMap],
	)
}

// empty string is a valid key: collect ungrouped items with it
const rkey = ''

export function useTreeItemGroups(
	items: TreeItem[],
	groups?: TreeGroup[],
	selectedKey?: string,
	onItemClick?: (item: TreeItem) => void,
	onItemExpandClick?: (item: TreeItem) => void,
): TreeItemGroup[] {
	const expansion = useExpansion(items, selectedKey)
	return useMemo(() => {
		const collected = collectItemsByGroup(items)
		return [
			...(groups || []),
			{
				key: rkey,
			},
		].map((group) => ({
			...group,
			items: makeDetailedItems(
				collected.get(group.key) || [],
				0,
				expansion,
				selectedKey,
				onItemClick,
				onItemExpandClick,
			),
		}))
	}, [items, groups, expansion, selectedKey, onItemClick, onItemExpandClick])
}

// sort items into groups, establishing a default group if none are provided
function collectItemsByGroup(items: TreeItem[]): Map<string, TreeItem[]> {
	return items.reduce((acc, cur) => {
		const group = cur.group || rkey
		const g = acc.get(group) || []
		g.push(cur)
		acc.set(group, g)
		return acc
	}, new Map<string, TreeItem[]>([[rkey, []]]))
}

// enrich each item recursively using top-level data
function makeDetailedItems(
	items: TreeItem[],
	depth: number,
	expansion: Expansion,
	selectedKey?: string,
	onItemClick?: (item: TreeItem) => void,
	onItemExpandClick?: (item: TreeItem) => void,
): TreeItem[] {
	return items.map((item) => {
		const { children, onClick, onExpand, selected, expanded, ...rest } = item
		const base: TreeItem = {
			...rest,
			depth,
			selected: selected || item.key === selectedKey,
			expanded: expanded || expansion.is(item.key),
			onExpand: (itm) => {
				expansion.on(itm.key)
				if (onExpand) {
					onExpand(itm)
				} else if (onItemExpandClick) {
					onItemExpandClick(itm)
				}
			},
			onClick:
				onClick || onItemClick
					? (itm) => {
							if (onClick) {
								onClick(itm)
							} else if (onItemClick) {
								onItemClick(itm)
							}
					  }
					: undefined,
		}
		if (children) {
			base.children = makeDetailedItems(
				children,
				depth + 1,
				expansion,
				selectedKey,
				onItemClick,
				onItemExpandClick,
			)
		}
		return base
	})
}


// Construct a default expansion map by rolling up an expand for any parents of selected or expanded children to the top of the tree.
// This is only used to initialize the expansion, so that user interactions are not overridden.
function forceExpansionToSelected(items: TreeItem[], selectedKey?: string): Record<string, boolean> {
	const collect = (children: TreeItem[], parentKey?: string): string[] => {
		return children.map(child => {
			if (child.children) {
				const childKeys = collect(child.children, child.key)
				if (childKeys && childKeys.length > 0) {
					return [child.key, ...childKeys]
				}
			}
			if (child.expanded) {
				return [child.key]
			}
			// if a child is selected, we actually want the _parent_ to be expanded, not the child itself
			if (child.selected || child.key === selectedKey) {
				return [parentKey]
			}
			return []
		})
		.flatMap(key => key) as string[]
	}
	return collect(items).reduce((acc, cur) => {
		acc[cur] = true
		return acc
	}, {} as Record<string, boolean>)
}
