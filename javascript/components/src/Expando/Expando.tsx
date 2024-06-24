/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Link } from '@fluentui/react'
import type { FC, PropsWithChildren } from 'react'
import { memo } from 'react'
import { When } from 'react-if'

import { useExpando, useExpandoStyles, useIcon } from './Expando.hooks.js'
import type { ExpandoProps } from './Expando.types.js'

/**
 * Toggle link with a chevron and show/hide of children.
 */
export const Expando: FC<PropsWithChildren<ExpandoProps>> = memo(
	function Expando({
		label,
		defaultExpanded,
		iconButtonProps,
		linkProps,
		styles,
		children,
	}) {
		const { expanded, onToggle } = useExpando(defaultExpanded)
		const buttonProps = useIcon(expanded, onToggle, iconButtonProps)
		const expandoStyle = useExpandoStyles(styles?.expando)
		return (
			<div style={styles?.root}>
				<div style={expandoStyle}>
					<IconButton {...buttonProps} />
					<Link onClick={onToggle} {...linkProps}>
						{label}
					</Link>
				</div>
				<When condition={expanded}>
					<div style={styles?.content}>{children}</div>
				</When>
			</div>
		)
	},
)
