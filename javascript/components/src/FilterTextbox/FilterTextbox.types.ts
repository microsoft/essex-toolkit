/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface FilterTextboxProps {
	/**
	 * Label to display above the textbox.
	 */
	label?: string
	/**
	 * Placeholder text to use when filter is in 'include' state.
	 */
	includePlaceholder?: string
	/**
	 * Placeholder text to use when filter is in 'exclude' state.
	 */
	excludePlaceholder?: string
	/**
	 * Callback that fires when filter text changes or the include/exclude button is toggled.
	 * @param text - value from the textbox
	 * @param exclude - indicates whether exclusion toggle was on
	 */
	onFilter?: (text: string, exclude: boolean) => any
}
