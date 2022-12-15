/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IRenderFunction } from '@fluentui/react'
import { DefaultButton, IconButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { TreeItemProps } from './Tree.types.js'
import {
	useContentButtonProps,
	useExpandIconButtonProps,
	useItemHoverInteraction,
	useMenuButtonProps,
} from './TreeItem.hooks.js'
import { useTreeItemStyles } from './TreeItem.styles.js'

/**
 * A TreeNode is contructed of buttons, selection indicators, and recursive children.
 * From the left:
 * (1) Selection indicator (pill), only displayed if item.selected is true
 * (2) Expand/collapse button, only visible if the item has children
 * (3) The main item content as a clickable button
 * (4) The far-right menu only shown on hover, and only if there are menu items
 *
 * The primary content resides within the listItemContent div, because that is the
 * level of interaction and styling we want for the row.
 * The outer li is too comprehensive because it grows if there are children.
 */
export const TreeItem: React.FC<TreeItemProps> = memo(function TreeItem(props) {
	const { item, styles, expandButtonProps, menuButtonProps, size } = props

	const _styles = useTreeItemStyles(item, styles, size)

	const _expandButtonProps = useExpandIconButtonProps(
		item,
		expandButtonProps,
		size,
	)

	const { listItemContentStyles, hovered, onMouseEnter, onMouseLeave } =
		useItemHoverInteraction(item, _styles)

	const _menuButtonProps = useMenuButtonProps(
		item,
		hovered,
		menuButtonProps,
		size,
	)

	return (
		<li style={_styles.listItem} key={`tree-item-li-${item.key}`}>
			<div
				style={listItemContentStyles}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<div style={_styles.indicator} />
				<div style={_styles.flexContainer}>
					{item.children && <IconButton {..._expandButtonProps} />}
					{titleRenderer(props)}
					{item.menuItems && <IconButton {..._menuButtonProps} />}
				</div>
			</div>
			{item.expanded && <ul style={_styles.list}>{contentRenderer(props)}</ul>}
		</li>
	)
})

const TreeItemTitle: React.FC<TreeItemProps> = memo(function TreeItemTitle(
	props,
) {
	const { item, contentButtonProps, size } = props
	const _contentButtonProps = useContentButtonProps(
		item,
		contentButtonProps,
		size,
	)
	const handleClick = useCallback(() => {
		item.onClick && item.onClick(item)
	}, [item])
	return (
		<DefaultButton
			{..._contentButtonProps}
			onClick={handleClick}
			title={item.text}
		>
			{item.text}
		</DefaultButton>
	)
})

const TreeItemContent: React.FC<TreeItemProps> = memo(function TreeItemTitle(
	props,
) {
	const {
		item,
		styles,
		expandButtonProps,
		contentButtonProps,
		menuButtonProps,
		size,
	} = props

	return (
		<>
			{item.children &&
				item.children.map(child => (
					<TreeItem
						key={child.key}
						item={child}
						styles={styles}
						expandButtonProps={expandButtonProps}
						contentButtonProps={contentButtonProps}
						menuButtonProps={menuButtonProps}
						size={size}
					/>
				))}
		</>
	)
})

const defaultTitleRenderer: IRenderFunction<TreeItemProps> = props => {
	return props ? <TreeItemTitle {...props} /> : null
}

const titleRenderer: IRenderFunction<TreeItemProps> = props => {
	return props?.item.onRenderTitle
		? props.item.onRenderTitle(props, defaultTitleRenderer)
		: defaultTitleRenderer(props)
}

const defaultContentRenderer: IRenderFunction<TreeItemProps> = props => {
	return props ? <TreeItemContent {...props} /> : null
}

const contentRenderer: IRenderFunction<TreeItemProps> = props => {
	return props?.item.onRenderContent
		? props.item.onRenderContent(props, defaultContentRenderer)
		: defaultContentRenderer(props)
}
