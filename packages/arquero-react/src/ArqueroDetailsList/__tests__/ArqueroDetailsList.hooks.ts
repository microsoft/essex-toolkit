import type {
	ICommandBarItemProps,
	ICommandBarProps,
	IDetailsColumnProps,
} from '@fluentui/react'
import { ReactElement, useCallback } from 'react'
import merge from 'lodash-es/merge.js'
import { CommandBar } from '../../CommandBar/CommandBar.js'

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

export function createDefaultCommandBar({
	styles,
	...props
}: ICommandBarProps): ReactElement<ICommandBarProps, any> {
	const defaultStyles = merge(defStyles, styles)
	return <CommandBar {...props} styles={defaultStyles} />
}

const defStyles = {
	root: {
		height: 36,
	},
	primarySet: {
		width: '100%',
	},
}
