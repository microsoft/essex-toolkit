/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnarMenu, ColumnarMenuList } from '@essex/themed-components'
import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { useCallback } from 'react'

const story = {
	title: '@essex:themed-components/ColumnarMenu',
}
export default story

const data = [
	{
		key: `section-0`,
		text: 'Reset',
		data: {
			button: true,
			bottomDivider: true,
		},
		onClick: () => console.log('Reset clicked'),
	},
	{
		key: `section-1`,
		itemType: ContextualMenuItemType.Section,
		sectionProps: {
			title: 'Eletronics',
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

const styles = {
	root: {
		width: 150,
	},
	label: {
		width: 120,
	},
}

export const ColumnarMenuStory = () => {
	const renderMenuList = useCallback(menuListProps => {
		return (
			<div>
				<ColumnarMenuList {...menuListProps} />
			</div>
		)
	}, [])

	const menuProps = {
		items: data,
		buttonStyles: styles,
		onRenderMenuList: renderMenuList,
		onItemClick: () => alert('item clicked'),
	}

	return <ColumnarMenu text={'Eletronics and furniture list'} {...menuProps} />
}

ColumnarMenuStory.story = {
	name: 'main',
}
