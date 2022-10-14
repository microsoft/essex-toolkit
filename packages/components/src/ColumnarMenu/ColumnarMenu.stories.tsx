/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnarMenuProps } from '@essex/components'
import { ColumnarMenu as ColumnarMenuComponent } from '@essex/components'
import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'

const storyMetadata = {
	title: '@essex:components/ColumnarMenu',
	component: ColumnarMenuComponent,
}
export default storyMetadata

const items = [
	{
		key: `section-1`,
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
		key: `section-2`,
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

const props = {
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
}

const Template = (args: ColumnarMenuProps) => {
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
			<ColumnarMenuComponent {...props} {...args}>
				Here is the child content!
			</ColumnarMenuComponent>
		</div>
	)
}

export const Primary = Template.bind({}) as any as {
	args: Partial<ColumnarMenuProps>
}
Primary.args = {
	text: 'Electronics and furniture list',
}

export const Customized = Template.bind({}) as any as {
	args: Partial<ColumnarMenuProps>
}
Customized.args = {
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
			background: 'azure',
		},
	},
	menuListProps: {
		styles: {
			header: {
				color: 'cornflowerblue',
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
}

export const Overflow = Template.bind({}) as any as {
	args: Partial<ColumnarMenuProps>
}
Overflow.args = {
	// demonstrates ellipsis text overflow
	text: 'ElectronicsAndFurnitureList.csv',
}

export const WithButtons = Template.bind({}) as any as {
	args: Partial<ColumnarMenuProps>
}

WithButtons.args = {
	text: 'Allows reset',
	items: [
		{
			key: `reset-button`,
			text: 'Reset',
			data: {
				button: true,
				bottomDivider: true,
			},
			onClick: () => alert('Reset clicked'),
		},
		...items,
	],
}
