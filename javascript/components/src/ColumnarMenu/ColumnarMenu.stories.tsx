/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'

import { ColumnarMenu } from './ColumnarMenu.js'
import type { ColumnarMenuProps } from './ColumnarMenu.types.js'

const items = [
	{
		key: 'section-1',
		itemType: ContextualMenuItemType.Section,
		sectionProps: {
			title: 'Electronics',
			items: [
				{
					key: 'Laptop',
					text: 'Laptop',
				},
				{
					key: 'Mouse',
					text: 'Mouse',
				},
				{
					key: 'Keyboard',
					text: 'Keyboard',
				},
			],
		},
	},
	{
		key: 'section-2',
		itemType: ContextualMenuItemType.Section,
		sectionProps: {
			title: 'Furniture',
			items: [
				{
					key: 'Table',
					text: 'Table',
					title: 'Table',
				},
				{
					key: 'Chair',
					text: 'Chair in a brown color with starts on top',
					title: 'Chair in a brown color with starts on top',
				},
			],
		},
	},
] as IContextualMenuItem[]

const StoryComponent: React.FC<ColumnarMenuProps> = (args) => {
	return (
		<div
			style={{
				width: 200,
				height: 100,
				padding: 12,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				border: '1px solid orange',
			}}
		>
			<ColumnarMenu {...args} />
		</div>
	)
}

const meta = {
	title: '@essex:components/ColumnarMenu',
	component: StoryComponent,
	args: {
		items,
		buttonStyles: {
			root: {
				width: 150,
			},
			label: {
				width: 120,
			},
		},
		onItemClick: () => alert('item clicked'),
	},
}
export default meta

export const Primary = {
	args: {
		text: 'Electronics and furniture list',
	},
}

export const Customized = {
	args: {
		text: 'Furniture',
		buttonProps: {
			styles: {
				root: {
					width: 120,
				},
			},
		},
		styles: {
			root: {
				background: 'aliceblue',
			},
		},
		menuListProps: {
			styles: {
				header: {
					color: 'dodgerblue',
				},
				column: {
					border: '1px dotted coral',
				},
				item: {
					root: {
						color: 'green',
					},
				},
			},
		},
	},
}

export const Overflow = {
	args: {
		// demonstrates ellipsis text overflow
		text: 'ElectronicsAndFurnitureList.csv',
	},
}

export const WithButtons = {
	args: {
		text: 'Allows reset',
		items: [
			{
				key: 'select-button',
				text: 'Select',
				data: {
					button: true,
					bottomDivider: true,
				},
				onClick: () => alert('Select clicked'),
			},
			{
				key: 'reset-button',
				text: 'Reset',
				data: {
					button: true,
					bottomDivider: true,
				},
				onClick: () => alert('Reset clicked'),
			},
			...items,
		],
	},
}
