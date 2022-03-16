/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnarMenu, ColumnarMenuList } from '@essex/themed-components'
import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { useCallback } from 'react'

import type { CSF } from './types'

const story = {
	title: 'ColumnarMenu',
}
export default story

const data = [
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
				},
				{
					key: 'Chair',
					text: 'Chair',
				},
			],
		},
	},
] as IContextualMenuItem[]

const styles = {
	root: {
		width: 100,
	},
}

export const ColumnarMenuStory: CSF = () => {
	const renderMenuList = useCallback(menuListProps => {
		return (
			<div>
				<ColumnarMenuList {...menuListProps} />
			</div>
		)
	}, [])

	const menuProps = {
		items: data,
		styles: styles,
		onRenderMenuList: renderMenuList,
	}

	return <ColumnarMenu text={'Test'} {...menuProps} />
}
ColumnarMenuStory.story = {
	name: 'main',
}
