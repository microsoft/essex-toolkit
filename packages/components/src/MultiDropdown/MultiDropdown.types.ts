/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption, IDropdownProps } from '@fluentui/react'

export interface MultiDropdownProps extends IDropdownProps {
	onChangeAll?: (
		event: React.MouseEvent<
			HTMLAnchorElement | HTMLButtonElement | HTMLElement
		>,
		options?: IDropdownOption[],
		indexes?: number[],
	) => void
}
