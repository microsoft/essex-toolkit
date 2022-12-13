/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'
import { useState } from 'react'

import { Tree } from '../Tree/Tree.js'
import type { TreeItem, TreeProps } from '../Tree/Tree.types.js'

const meta = {
	title: '@essex:components/Tree',
	component: Tree,
}
export default meta

const onClick = (evt: any, item: any) => console.log(evt, item)

const TREE_ITEMS: TreeItem[] = [
	{
		text: 'Item 1',
		key: 'item-1',
		menuItems: [
			{
				key: 'item-1-add',
				text: 'Add item',
				iconProps: {
					iconName: 'Add',
				},
				onClick,
			},
			{
				key: 'item-1-delete',
				text: 'Remove item',
				iconProps: {
					iconName: 'Delete',
				},
				onClick,
			},
		],
		children: [
			{
				text: 'Item 1.1',
				key: 'item-1.1',
				menuItems: [
					{
						key: 'item-1.1-add',
						text: 'Add item',
						iconProps: {
							iconName: 'Add',
						},
						onClick,
					},
					{
						key: 'item-1.1-delete',
						text: 'Remove item',
						iconProps: {
							iconName: 'Delete',
						},
						onClick,
					},
				],
				children: [
					{
						text: 'Item 1.1.1',
						key: 'item-1.1.1',
					},
					{
						text: 'Item 1.1.2',
						key: 'item-1.1.2',
					},
				],
			},
			{
				text: 'Item 1.2',
				key: 'item-1.2',
			},
		],
	},
	{
		text: 'Item 2',
		key: 'item-2',
		iconName: 'TableComputed',
		children: [
			{
				text: 'Item 2.1',
				key: 'item-2.1',
				iconName: 'Database',
				children: [
					{
						text: 'Item 2.1.1',
						key: 'item-2.1.1',
						iconName: 'Calendar',
					},
					{
						text: 'Item 2.1.2',
						key: 'item-2.1.2',
						iconName: 'Table',
					},
				],
			},
			{
				text: 'Item 2.2',
				key: 'item-2.2',
				iconName: 'LightningBolt',
			},
		],
	},
	{
		text: 'Item 3',
		key: 'item-3',
		children: [
			{
				key: 'item-3.1',
				text: 'Item 3.1',
			},
		],
	},
	{
		text: 'Item 4',
		key: 'item-4',
	},
]

const Template: ComponentStory<typeof Tree> = (args: TreeProps) => {
	const [selected, setSelected] = useState<string | undefined>()
	return (
		<div
			style={{
				display: 'flex',
				gap: 20,
			}}
		>
			<div>
				Medium size (default)
				<div
					style={{
						width: 300,
						height: 400,
						border: '1px solid orange',
					}}
				>
					<Tree
						{...args}
						selectedKey={selected}
						onItemClick={item => setSelected(item.key)}
					></Tree>
				</div>
			</div>
			<div>
				Small size
				<div
					style={{
						width: 300,
						height: 400,
						border: '1px solid orange',
					}}
				>
					<Tree
						{...args}
						size={'small'}
						selectedKey={selected}
						onItemClick={item => setSelected(item.key)}
						onItemExpandClick={item => console.log('expand clicked', item)}
					></Tree>
				</div>
				<div></div>
			</div>
		</div>
	)
}

export const Primary = Template.bind({})
Primary.args = {
	items: TREE_ITEMS,
}

export const Customized = Template.bind({})
Customized.args = {
	items: TREE_ITEMS,
	styles: {
		listItemContent: {
			background: 'azure',
		},
		indicator: {
			borderRadius: 3,
			borderWidth: 3,
			height: 3,
		},
	},
	expandButtonProps: {
		expandIconName: 'Add',
		collapseIconName: 'Remove',
	},
	contentButtonProps: {
		styles: {
			label: {
				color: 'darkorange',
				fontFamily: 'monospace',
			},
		},
		iconProps: {
			styles: {
				root: {
					fontSize: 16,
					color: 'orange',
				},
			},
		},
	},
	menuButtonProps: {
		alwaysVisible: true,
		menuIconProps: {
			iconName: 'LightningBolt',
		},
		styles: {
			root: {
				color: 'dodgerblue',
			},
			rootHovered: {
				color: 'dodgerblue',
			},
			rootPressed: {
				color: 'dodgerblue',
			},
			rootExpanded: {
				color: 'dodgerblue',
			},
		},
		onMenuClick: (e: any) => console.log('menu click', e),
		onAfterMenuDismiss: () => console.log('menu dismiss'),
	},
}

export const ItemProps = Template.bind({})
// add in a few custom click, selection, etc. props to test full item overrides
ItemProps.args = {
	items: [
		{
			key: 'item-1',
			text: 'Item 1 (selected, onClick)',
			selected: true,
			onClick: item => console.log('click override', item),
			children: [
				{
					key: 'item-1.1',
					text: 'Item 1.1 (expanded, onExpand)',
					expanded: true,
					onExpand: item => console.log('expand override', item),
					children: [
						{
							key: 'item-1.1.1 ',
							text: 'Item 1.1.1 (selected)',
							selected: true,
						},
					],
				},
			],
		},
	],
}

// illustrate two groups, with the remaining item orphaned into the default
export const Grouped = Template.bind({})
Grouped.args = {
	items: TREE_ITEMS.map((item, index) => ({
		...item,
		group: index < 2 ? 'group-1' : index < 3 ? 'group-2' : undefined,
	})),
	groups: [
		{
			key: 'group-1',
			text: 'Group 1',
		},
		{
			key: 'group-2',
			text: 'Group 2',
		},
	],
}

export const CustomRenderers = Template.bind({})
CustomRenderers.args = {
	items: [
		{
			key: 'item-1',
			text: 'Item 1 (normal)',
		},
		{
			key: 'item-2',
			onRenderTitle: () => (
				<div
					style={{
						padding: 4,
						background: 'azure',
						border: '1px solid dodgerblue',
					}}
				>
					Custom title
				</div>
			),
		},
		{
			key: 'item-3',
			text: 'Item 3',
			expanded: true,
			onRenderContent: (props, defaultRenderer) => {
				const depth = (props?.item.depth || 0) + 1
				return (
					<div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 4,
								padding: 4,
								paddingLeft: depth * 12 + 32,
							}}
						>
							<div style={fieldStyle}>
								<div>Add codebook</div>
							</div>
							<div style={fieldStyle}>
								<div>Add workflow</div>
							</div>
						</div>
						{defaultRenderer?.(props)}
					</div>
				)
			},
			children: [
				{
					key: 'item-3.1',
					text: 'table.csv',
					iconName: 'Table',
				},
			],
		},
	],
}

const fieldStyle = {
	width: 80,
	height: 24,
	background: '#efefef',
	border: '1px dotted #ccc',
	borderRadius: 3,
	fontSize: 10,
	display: 'flex',
	alignItems: 'center',
	padding: 4,
}