/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICommandBarItemProps,
	ICommandBarStyleProps,
	ICommandBarStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

export interface EnumButtonBarProps<E> {
	enumeration: any
	selected?: E
	onChange?: (selected: string | number) => void
	styles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>
	/**
	 * List of icons for each enum option. Must match the indices of the enum entries.
	 */
	iconNames?: string[]
	iconOnly?: boolean
}

const splitCamel = (str: string) => str.replace(/([a-z\d])([A-Z])/g, '$1 $2')

export function EnumButtonBar<E>({
	enumeration,
	selected,
	onChange,
	styles,
	iconNames,
	iconOnly,
}: EnumButtonBarProps<E>): JSX.Element {
	const selectedKey = useMemo(() => {
		const entry = Object.entries(enumeration).find(
			([text, value]) => value === selected,
		)
		return entry ? entry[1] : undefined
	}, [enumeration, selected])

	const handleChange = useCallback(
		(s: string | number) => onChange?.(s),
		[onChange],
	)

	const options = useMemo<ICommandBarItemProps[]>(
		() =>
			Object.entries(enumeration).map((m, i) => {
				const key = m[1] as string
				const text = splitCamel(m[0])
				return {
					key,
					text,
					checked: selectedKey === key,
					iconProps: iconNames ? { iconName: iconNames[i] } : undefined,
					iconOnly,
					onClick: () => handleChange(key),
				}
			}),
		[enumeration, handleChange, iconNames, iconOnly, selectedKey],
	)
	return <CommandBar items={options} styles={styles} />
}
