/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { useTreeItemGroups } from './Tree.hooks.js'
import { useTreeStyles } from './Tree.styles.js'
import type { TreeProps } from './Tree.types.js'
import { TreeItem } from './TreeItem.js'

export const Tree: React.FC<TreeProps> = memo(function Tree({
	items,
	groups,
	selectedKey,
	onItemClick,
	onItemExpandClick,
	styles,
	expandButtonProps,
	contentButtonProps,
	menuButtonProps,
	size = 'medium',
}) {
	const _styles = useTreeStyles(styles, size)

	const treeGroups = useTreeItemGroups(
		items,
		groups,
		selectedKey,
		onItemClick,
		onItemExpandClick,
	)
	return (
		<div style={_styles.root}>
			{treeGroups.map(group => {
				return (
					<div style={_styles.group} key={`tree-group-${group.key}`}>
						<ul style={_styles.list}>
							{group.text && (
								<div style={_styles.groupHeader}>{group.text}</div>
							)}
							{group.items.map(item => (
								<TreeItem
									key={item.key}
									item={item}
									styles={styles}
									expandButtonProps={expandButtonProps}
									contentButtonProps={contentButtonProps}
									menuButtonProps={menuButtonProps}
									size={size}
								/>
							))}
						</ul>
					</div>
				)
			})}
		</div>
	)
})
