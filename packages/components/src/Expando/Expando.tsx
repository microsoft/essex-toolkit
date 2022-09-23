/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IIconStyles } from '@fluentui/react'
import { IconButton, Link } from '@fluentui/react'
import { memo } from 'react'
import { When } from 'react-if'

import { useExpando } from './Expando.hooks.js'
import { defaultIconStyles, defaultToggleStyles } from './Expando.styles.js'

export interface ExpandoProps
	extends React.PropsWithChildren<{
		/* nothing */
	}> {
	label: string
	defaultExpanded?: boolean
	iconStyles?: IIconStyles
	toggleStyles?: React.CSSProperties
}

/**
 * Toggle link with a chevron and show/hide of children.
 */
export const Expando: React.FC<ExpandoProps> = memo(function Expando({
	label,
	defaultExpanded,
	iconStyles = defaultIconStyles,
	toggleStyles = defaultToggleStyles,
	children,
}) {
	const { expanded, onToggle } = useExpando(defaultExpanded)
	return (
		<>
			<div style={toggleStyles}>
				<IconButton
					styles={iconStyles}
					iconProps={{
						iconName: expanded ? 'ChevronDown' : 'ChevronRight',
						styles: iconStyles,
					}}
					onClick={onToggle}
				/>
				<Link onClick={onToggle}>{label}</Link>
			</div>
			<When condition={expanded}>{children}</When>
		</>
	)
})
