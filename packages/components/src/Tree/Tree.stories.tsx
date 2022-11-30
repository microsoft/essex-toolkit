/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState } from 'react'

import { Tree } from '../Tree/Tree.js'
import type { TreeProps } from '../Tree/Tree.types.js'

const meta = {
	title: '@essex:components/Tree',
	component: Tree,
}
export default meta

const Template = (args: TreeProps) => {
	const [selected, setSelected] = useState<string | undefined>()
	return (
		<div
			style={{
				width: 300,
				height: 600,
				border: '1px solid orange',
			}}
		>
			<Tree
				{...args}
				selectedKey={selected}
				onItemClick={item => setSelected(item.key)}
			></Tree>
		</div>
	)
}

export const Primary = Template.bind({}) as any as { args: TreeProps }

Primary.args = {
	items: [
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
					onClick: () => console.log('clicked item-1 add'),
				},
				{
					key: 'item-1-delete',
					text: 'Remove item',
					iconProps: {
						iconName: 'Delete',
					},
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
						},
						{
							key: 'item-1.1-delete',
							text: 'Remove item',
							iconProps: {
								iconName: 'Delete',
							},
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
	],
}
