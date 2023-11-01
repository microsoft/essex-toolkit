/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCloseIconProps } from './Chip.hooks.js'
import { useChipStyles } from './Chip.styles.js'
import type { ChipItemProps } from './Chips.types.js'
import { Icon, IconButton } from '@fluentui/react'
import { memo } from 'react'

export const Chip: React.FC<ChipItemProps> = memo(function Chip({
	item,
	styles,
	onClose,
	onClick,
}): JSX.Element {
	const _styles = useChipStyles(styles)
	const closeProps = useCloseIconProps(_styles)
	return (
		<div style={_styles.root} onClick={onClick} onKeyPress={onClick}>
			{item.iconName && <Icon styles={_styles.icon} iconName={item.iconName} />}
			{item.text && <div>{item.text}</div>}
			{item.canClose && (
				<IconButton
					styles={_styles.close}
					iconProps={closeProps}
					onClick={onClose}
					ariaLabel={item.text || item.iconName}
				/>
			)}
		</div>
	)
})
