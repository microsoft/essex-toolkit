import type { ICommandBarProps } from '@fluentui/react'
import type { ReactElement } from 'react'
import merge from 'lodash-es/merge.js'
import { CommandBar } from '../../CommandBar/CommandBar.js'

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
