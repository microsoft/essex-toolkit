/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Chip } from './Chip.js'
import { useChipsStyles } from './Chips.styles.js'
import type { ChipsProps } from './Chips.types.js'
import { memo } from 'react'

export const Chips: React.FC<ChipsProps> = memo(function Chips({
	items,
	styles,
	onClose,
	onClick,
}): JSX.Element {
	const _styles = useChipsStyles(styles)
	return (
		<div style={_styles.root}>
			{items.map((item) => {
				const handleClick = () => onClick?.(item.key)
				const handleClose = () => onClose?.(item.key)
				return (
					<Chip
						key={`chip-${item.key}`}
						item={item}
						onClick={handleClick}
						onClose={handleClose}
					/>
				)
			})}
		</div>
	)
})
