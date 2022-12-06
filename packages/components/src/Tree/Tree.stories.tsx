/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
	},
]

const Template = (args: TreeProps) => {
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
					></Tree>
				</div>
				<div></div>
			</div>
		</div>
	)
}

export const Primary = Template.bind({}) as any as { args: TreeProps }
Primary.args = {
	items: TREE_ITEMS,
}

export const Customized = Template.bind({}) as any as { args: TreeProps }
Customized.args = {
	items: TREE_ITEMS,
	styles: {
		listItemContent: {
			background: 'azure',
		},
		indicator: {
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

export const ItemProps = Template.bind({}) as any as { args: TreeProps }
// add in a few custom click, selection, etc. props to test full item overrives
ItemProps.args = {
	items: [
		{
			key: 'item-1',
			text: 'Item 1 (selected, onClick)',
			selected: true,
			onClick: item => console.log('click', item),
			children: [
				{
					key: 'item-1.1',
					text: 'Item 1.1 (expanded)',
					expanded: true,
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
