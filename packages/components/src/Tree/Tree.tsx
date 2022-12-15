/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IRenderFunction } from '@fluentui/react'
import { memo } from 'react'

import { useTreeItemGroups } from './Tree.hooks.js'
import { useTreeStyles } from './Tree.styles.js'
import type { TreeGroupProps, TreeProps } from './Tree.types.js'
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
	onRenderGroupHeader,
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
							{groupHeaderRenderer({
								group,
								styles,
								size,
								onRenderGroupHeader,
							})}
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

const TreeGroupHeader: React.FC<TreeGroupProps> = memo(function TreeGroupHeader(
	props,
) {
	const { group, styles, size } = props
	const _styles = useTreeStyles(styles, size)
	return (
		<>
			{group.text && (
				<div style={_styles.groupHeader} title={group.text}>
					{group.text}
				</div>
			)}
		</>
	)
})

const defaultGroupHeaderRenderer: IRenderFunction<TreeGroupProps> = props => {
	return props ? <TreeGroupHeader {...props} /> : null
}

const groupHeaderRenderer: IRenderFunction<TreeGroupProps> = props => {
	return props?.onRenderGroupHeader
		? props.onRenderGroupHeader(props, defaultGroupHeaderRenderer)
		: defaultGroupHeaderRenderer(props)
}
