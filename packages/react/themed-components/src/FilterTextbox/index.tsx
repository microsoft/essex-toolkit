/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Label, TextField } from '@fluentui/react'
import { useState } from 'react'

export interface TextFilterProps {
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

/**
 * This component presents a compound textbox filter that includes an inline
 * toggle button to switch between inclusion and exclusion of the filter text.
 * To use this component, ensure that Fluent is bootstrapped to include loaded icons
 * See https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
 */
export const FilterTextbox = ({
	label,
	includePlaceholder = 'contains...',
	excludePlaceholder = 'does not contain...',
	onFilter = () => null,
}: TextFilterProps): JSX.Element => {
	const [checked, setChecked] = useState<boolean>(false)
	const [text, setText] = useState<string>('')

	const handleCheck = (isChecked: boolean) => {
		setChecked(isChecked)
		onFilter(text, isChecked)
	}

	const handleTextChange = (event: any) => {
		const inputText = event.target.value
		setText(inputText)
		onFilter(inputText, checked)
	}

	return (
		<div>
			{label ? <Label>{label}</Label> : null}
			{/* the intent of all this styling is to make sort of a unified compound button + textbox that looks like a single control */}
			<div style={{ display: 'flex' }}>
				<IconButton
					checked
					title={`Click to ${checked ? 'include' : 'exclude'} matching items`}
					styles={{
						root: {
							border: '1px solid',
							borderRight: 'none',
							borderRadius: '2px 0 0 2px',
						},
					}}
					iconProps={{
						iconName: checked ? 'ClearFilter' : 'Filter',
					}}
					onClick={() => handleCheck(!checked)}
				/>
				<TextField
					onChange={handleTextChange}
					value={text}
					placeholder={checked ? excludePlaceholder : includePlaceholder}
					styles={{
						fieldGroup: {
							borderRadius: '0 2px 2px 0',
							borderLeft: 'none',
						},
					}}
				/>
			</div>
		</div>
	)
}
