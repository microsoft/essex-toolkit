/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton } from '@fluentui/react'
import { useCallback, useState } from 'react'

import { Chips } from './Chips.js'
import type { ChipsProps } from './Chips.types.js'

const meta = {
	title: '@essex:components/Chips',
	component: Chips,
}
export default meta

const PrimaryComponent: React.FC<ChipsProps> = (args) => {
	const [items, setItems] = useState(args.items)
	const handleClickAdd = useCallback(() => {
		const rando = Math.round(Math.random() * 1000)
		console.log('adding chip', rando)
		setItems((prev) => [
			...prev,
			{
				key: `${rando}`,
				text: `Chip ${rando}`,
				canClose: true,
			},
		])
	}, [])
	const handleClose = useCallback((key: string) => {
		console.log('removing chip', key)
		setItems((prev) => prev.filter((i) => i.key !== key))
	}, [])
	const handleClickChip = useCallback(
		(key: string) => console.log('clicked chip', key),
		[],
	)
	return (
		<div style={{ display: 'flex', alignItems: 'center'}}>
			<Chips
				{...args}
				items={items}
				onClose={handleClose}
				onClick={handleClickChip}
			/>
			<div
				style={{
					marginLeft: 36,
				}}
			>
				<ActionButton
					iconProps={{
						iconName: 'Add',
					}}
					onClick={handleClickAdd}
				>
					Add chip
				</ActionButton>
			</div>
		</div>
	)
}

const defaultChips = [
	{
		key: 'chip-1',
		text: 'Chip 1',
		iconName: 'Calendar',
		canClose: true,
	},
	{
		key: 'chip-2',
		text: 'Chip 2',
		canClose: true,
	},
	{
		key: 'chip-6',
		iconName: 'TextDocument',
		canClose: true,
	},
	{
		key: 'chip-3',
		text: 'Chip 3',
		iconName: 'Filter',
	},
	{
		key: 'chip-4',
		text: 'Chip 4',
	},
	{
		key: 'chip-5',
		iconName: 'Home',
	},
]

export const Primary = {
	render: (args: ChipsProps) => <PrimaryComponent {...args} />,
	args: {
		items: defaultChips,
	},
}

export const Customized = {
	render: (args: ChipsProps) => <PrimaryComponent {...args} />,
	args: {
		items: defaultChips,
		styles: {
			root: {
				border: '1px solid orange',
				background: 'aliceblue',
				padding: 8,
				fontSize: 24,
				borderRadius: 12,
			},
			item: {
				background: 'coral',
				padding: 12,
				borderRadius: 12,
			},
			icon: {
				root: {
					color: 'white',
				},
			},
			close: {
				root: {
					color: 'white',
				},
			},
		},
	},
}
