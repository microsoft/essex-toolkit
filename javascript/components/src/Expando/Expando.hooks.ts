/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import type { CSSProperties } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { defaultExpandoStyle, defaultIconStyles } from './Expando.styles.js'
/**
 * Manage expando state to toggle visibility of the children.
 * @param inputs
 * @returns
 */
export function useExpando(defaultExpanded = false): {
	expanded: boolean
	onToggle: () => void
} {
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded)

	const onToggle = useCallback(
		() => setExpanded((prev) => !prev),
		[setExpanded],
	)
	return {
		expanded,
		onToggle,
	}
}

export function useExpandoStyles(style?: CSSProperties): CSSProperties {
	return useMemo(() => merge({}, defaultExpandoStyle, style), [style])
}

export function useIcon(
	expanded: boolean,
	onToggle: () => void,
	iconButtonProps?: IButtonProps,
) {
	return useMemo(
		() =>
			merge(
				{},
				{
					styles: defaultIconStyles,
					iconProps: {
						iconName: expanded ? 'ChevronDown' : 'ChevronRight',
						styles: defaultIconStyles,
					},
					onClick: onToggle,
				},
				iconButtonProps,
			),
		[expanded, onToggle, iconButtonProps],
	)
}
