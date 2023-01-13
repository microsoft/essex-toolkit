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
						children: [
							{
								text: 'Item 1.1.1.1',
								key: 'item-1.1.1.1',
							},
							{
								text: 'Item 1.1.1.2',
								key: 'item-1.1.1.2',
							},
						],
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
			{
				text: 'Item 1.3',
				key: 'item-1.3',
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
						children: [
							{
								text: 'Item 2.1.1.1',
								key: 'item-2.1.1.1',
								iconName: 'Document',
							},
							{
								text: 'Item 2.1.1.2',
								key: 'item-2.1.1.2',
								iconName: 'Home',
							},
						],
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
			{
				text: 'Item 2.3',
				key: 'item-2.3',
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

const containerStyle: React.CSSProperties = {
	display: 'flex',
	gap: 20,
}

const boxStyle: React.CSSProperties = {
	width: 300,
	height: 400,
	border: '1px solid orange',
	overflowY: 'scroll',
}

const Template: ComponentStory<typeof Tree> = (args: TreeProps) => {
	const [selected, setSelected] = useState<string | undefined>(args.selectedKey)

	return (
		<div style={containerStyle}>
			<div>
				Medium size (default)
				<div style={boxStyle}>
					<Tree
						{...args}
						selectedKey={selected}
						onItemClick={(item) => setSelected(item.key)}
						onItemExpandClick={(item) => console.log('expand clicked', item)}
					/>
				</div>
			</div>
			<div>
				Small size
				<div style={boxStyle}>
					<Tree
						{...args}
						size={'small'}
						selectedKey={selected}
						onItemClick={(item) => setSelected(item.key)}
						onItemExpandClick={(item) => console.log('expand clicked', item)}
					/>
				</div>
				<div />
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
			background: 'aliceblue',
		},
		hierarchyLine: {
			borderColor: 'transparent',
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

export const NestedSelections = Template.bind({})
// add in a few custom click, selection, etc. props to test full item overrides
NestedSelections.args = {
	selectedKey: 'item-1.1.1',
	items: [
		{
			key: 'item-1',
			text: 'Item 1 (default expands to selected child)',
			children: [
				{
					key: 'item-1.1',
					text: 'Item 1.1',
					children: [
						{
							key: 'item-1.1.1',
							text: 'Item 1.1.1 (default selectedKey)',
							children: [
								{
									key: 'item-1.1.1.1',
									text: 'Item 1.1.1.1',
								},
							],
						},
					],
				},
			],
		},
		{
			key: 'item-2',
			text: 'Item 2 (default expands to expanded child)',
			children: [
				{
					key: 'item-2.1',
					text: 'Item 2.1',
					children: [
						{
							key: 'item-2.1.1',
							text: 'Item 2.1.1 (static expanded prop)',
							expanded: true,
							children: [
								{
									key: 'item-2.1.1.1',
									text: 'Item 2.1.1.1',
								},
							],
						},
					],
				},
			],
		},
		{
			key: 'item-3',
			text: 'Item 3 (onClick override)',
			onClick: (item) => console.log('click override', item),
		},
	],
}

export const Narrow = Template.bind({})
Narrow.args = {
	narrow: true,
	items: TREE_ITEMS,
	styles: {
		root: {
			border: '1px solid dodgerblue',
			width: 36,
		},
	},
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
	onRenderGroupHeader: (props, defaultRenderer) => {
		return (
			<>
				{props?.group.key === 'group-1' ? (
					<div style={groupStyle}>{`${props.group.text} (custom)`}</div>
				) : (
					defaultRenderer?.(props)
				)}
			</>
		)
	},
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
	items: [
		{
			key: 'item-1',
			text: 'Item 1 (normal)',
			group: 'group-1',
		},
		{
			key: 'item-2',
			text: 'Item 2',
			group: 'group-2',
			children: [
				{
					key: 'item-2.1',
					text: 'Item 2.1',
					iconName: 'Table',
				},
			],
			onRenderTitle: (props) => (
				<div
					style={{
						padding: 4,
						background: 'aliceblue',
						border: '1px solid dodgerblue',
					}}
				>
					<>{`${props?.item.text} (Custom title)`}</>
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

const groupStyle = {
	padding: 8,
	background: 'aliceblue',
	borderBottom: '2px solid dodgerblue',
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
