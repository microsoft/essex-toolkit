import type { ICommandBarItemProps, IDetailsColumnProps } from '@fluentui/react'
import { useCallback } from 'react'
import { createDefaultCommandBar } from './component-factories.js'

export function useColumnCommands(): (
	props?: IDetailsColumnProps,
) => JSX.Element {
	return useCallback((props?: IDetailsColumnProps): JSX.Element => {
		const items = [
			{
				key: 'add',
				text: 'Add',
				iconOnly: true,
				iconProps: { iconName: 'Add' },
				onClick: () => console.log('add', props),
			},
			{
				key: 'edit',
				text: 'Edit',
				iconOnly: true,
				iconProps: { iconName: 'Edit' },
				onClick: () => console.log('edit', props),
			},
			{
				key: 'delete',
				text: 'Delete',
				iconOnly: true,
				iconProps: { iconName: 'Delete' },
				onClick: () => console.log('delete', props),
			},
		] as ICommandBarItemProps[]
		return createDefaultCommandBar({
			items,
			styles: {
				root: {
					display: 'flex',
					justifyContent: 'center',
				},
			},
		})
	}, [])
}
