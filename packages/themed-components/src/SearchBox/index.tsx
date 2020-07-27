/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { useState, useCallback } from 'react'
import { PrimaryButton, TextField } from '@fluentui/react'

const static_style = { display: 'flex', alignItems: 'flex-end' }
const static_text_style = { flex: 1, marginRight: 8 }
export interface SearchBoxProps {
	/**
	 * Value to display in the box on initial display.
	 */
	defaultValue?: string
	/**
	 * Label above the search box.
	 */
	label?: string
	/**
	 * Placeholder text for the empty text field.
	 */
	placeholder?: string
	/**
	 * Error message to display below the text field when applicable.
	 */
	errorMessage?: string
	/**
	 * Callback to receive query text when the user presses enter or clicks the search button.
	 */
	onSearch?: (query: string) => any
}

/**
 * Extends the idea of a SearchBox to include the Search button alongside the text field.
 * Note that this is a compound TextField + PrimaryButton. We may want to switch the the Fluent SearchBox
 * field, which includes autocomplete capability.
 */
export const SearchBox = ({
	defaultValue = '',
	label,
	placeholder,
	errorMessage,
	onSearch = () => null,
}: SearchBoxProps): JSX.Element => {
	const [queryText, setQueryText] = useState<string>(defaultValue)

	const handleQueryChange = (event: React.FormEvent, newValue?: string) => {
		setQueryText(newValue || '')
	}

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.keyCode === 13) {
				onSearch(queryText)
			}
		},
		[onSearch, queryText],
	)

	const handleSearch = useCallback(() => onSearch(queryText), [
		onSearch,
		queryText,
	])

	return (
		<div style={static_style}>
			<div style={static_text_style}>
				<TextField
					label={label}
					placeholder={placeholder}
					defaultValue={defaultValue}
					errorMessage={errorMessage}
					onChange={handleQueryChange}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<PrimaryButton onClick={handleSearch}>Search</PrimaryButton>
		</div>
	)
}
