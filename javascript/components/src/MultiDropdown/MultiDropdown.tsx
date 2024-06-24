/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { useDropdownOptions, useOptionRenderer } from './MultiDropdown.hooks.js'
import type { MultiDropdownProps } from './MultiDropdown.types.js'

/**
 * Dropdown wrapper to manage multi-select with a select all/none helper.
 */
export const MultiDropdown: React.FC<MultiDropdownProps> = memo(
	function MultiDropdown({ options, onChangeAll, ...props }) {
		const opts = useDropdownOptions(options)
		const handleRenderOption = useOptionRenderer(options, onChangeAll)
		return (
			<Dropdown
				multiSelect
				options={opts}
				onRenderOption={handleRenderOption}
				{...props}
			/>
		)
	},
)
