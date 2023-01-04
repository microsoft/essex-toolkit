/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ChoiceGroup, Dropdown, TextField } from '@fluentui/react'
import { useCallback } from 'react'

import type { ControlProps } from './Settings.types.js'
import { ControlType } from './Settings.types.js'

/**
 * TextControl creates either thematic themed TextField, Dropdown, or ChoiceGroup
 * as a Fluent component based on config options
 */
export const TextControl = ({
	config,
	onChange,
}: ControlProps): JSX.Element => {
	const { key, value, type, label, control, params } = config
	const handleTextChange = useCallback(
		(evt, text) => {
			onChange?.(key, text)
		},
		[key, onChange],
	)
	const handleOptionChange = useCallback(
		(evt, option) => {
			onChange?.(key, option.text)
		},
		[key, onChange],
	)
	switch (control) {
		case ControlType.textbox:
			return (
				<TextField
					key={`textfield-${key}`}
					label={label}
					value={value}
					onChange={handleTextChange}
				/>
			)
		case ControlType.dropdown:
			if (!params?.options) {
				throw new Error('Dropdown control type requires list of options')
			}
			return (
				<Dropdown
					key={`dropdown-${key}`}
					label={label}
					options={params.options.map((opt) => ({
						key: opt,
						text: opt,
						selected: opt === value,
					}))}
					onChange={handleOptionChange}
				/>
			)
		case ControlType.radio:
			if (!params?.options) {
				throw new Error('Radio control type requires list of options')
			}
			return (
				<ChoiceGroup
					key={`radio-${key}`}
					label={label}
					selectedKey={value}
					options={params?.options.map((opt) => ({
						key: opt,
						text: opt,
					}))}
					onChange={handleOptionChange}
				/>
			)
		default:
			throw new Error(
				`Unsupported control type ${JSON.stringify(control)} for ${type}`,
			)
	}
}
