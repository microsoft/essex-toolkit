/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption, ISelectableOption } from '@fluentui/react'
import { Link, Separator } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { useCallback, useMemo } from 'react'

import { linkStyles, wrapperStyle } from './MultiDropdown.styles.js'
import type { MultiDropdownProps } from './MultiDropdown.types.js'

const divider: IDropdownOption = {
	key: '--divider--',
	text: '-',
	itemType: 1,
	selected: false,
}

const actions: IDropdownOption = {
	key: '--actions--',
	text: '',
	itemType: 2,
	selected: false,
}

export function useDropdownOptions(
	options: MultiDropdownProps['options'],
): IDropdownOption<any>[] {
	return useMemo(() => [actions, divider, ...options], [options])
}

export function useOptionRenderer(
	options: MultiDropdownProps['options'],
	onChangeAll: MultiDropdownProps['onChangeAll'],
): IRenderFunction<ISelectableOption<any>> {
	const handleSelectAll = useCallback(
		(
			event: React.MouseEvent<
				HTMLAnchorElement | HTMLButtonElement | HTMLElement
			>,
		) => onChangeAll?.(event, options),
		[onChangeAll, options],
	)
	const handleSelectNone = useCallback(
		(
			event: React.MouseEvent<
				HTMLAnchorElement | HTMLButtonElement | HTMLElement
			>,
		) => onChangeAll?.(event, []),
		[onChangeAll],
	)

	const handleRenderOption: IRenderFunction<ISelectableOption<any>> =
		useCallback(
			(option?: ISelectableOption) => {
				if (option?.key === '--actions--') {
					return (
						<div style={wrapperStyle}>
							<Link styles={linkStyles} onClick={handleSelectAll}>
								All
							</Link>
							<Separator vertical />
							<Link styles={linkStyles} onClick={handleSelectNone}>
								None
							</Link>
						</div>
					)
				} else {
					return <>{option?.text}</>
				}
			},
			[handleSelectAll, handleSelectNone],
		)
	return handleRenderOption
}
