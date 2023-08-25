/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCloseIconProps } from './Chips.hooks.js'
import { useChipsStyles } from './Chips.styles.js'
import type { ChipsProps } from './Chips.types.js'
import { Icon, IconButton } from '@fluentui/react'

export function Chips({
	items,
	styles,
	onClose,
	onClick,
}: ChipsProps): JSX.Element {
	const _styles = useChipsStyles(styles)
	const closeProps = useCloseIconProps(_styles)
	return (
		<div style={_styles.root}>
			{items.map((item) => {
				const handleClick = () => onClick?.(item.key)
				return (
					<div
						key={`chip-${item.key}`}
						style={_styles.item}
						onClick={handleClick}
						onKeyPress={handleClick}
					>
						{item.iconName && (
							<Icon styles={_styles.icon} iconName={item.iconName} />
						)}
						{item.text && <div>{item.text}</div>}
						{item.canClose && (
							<IconButton
								styles={_styles.close}
								iconProps={closeProps}
								onClick={() => onClose?.(item.key)}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}
