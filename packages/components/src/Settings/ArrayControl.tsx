/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Dropdown, Label, TextField } from '@fluentui/react'
import { useCallback } from 'react'

import { checkboxesStyle } from './Settings.styles.js'
import type { ControlProps } from './Settings.types.js'
import { ControlType } from './Settings.types.js'

/**
 * ArrayControl creates either thematic themed Multi-select Dropdown or a list of Checkboxes
 * as a Fluent component based on config options
 */
export const ArrayControl = ({
	config,
	onChange,
}: ControlProps): JSX.Element => {
	const { key, value, type, label, control, params } = config
	const handleTextChange = useCallback(
		(_evt: unknown, text?: string | undefined) => onChange?.(key, text?.split(',')),
		[key, onChange],
	)
	const handleOptionChange = useCallback(
		(_evt: unknown, option: { text: string | undefined } | undefined) =>
			onChange?.(key, option?.text),
		[key, onChange],
	)
	const handleCheckChange = useCallback(
		(val: any, checked?: boolean) => {
			if (onChange) {
				if (value) {
					if (checked) {
						onChange(key, [...value, val])
					} else {
						onChange(key, value.filter((v: any) => v!== val))
					}	
				} else {
					onChange(key, [val])
				}
			}
		},
		[key, value, onChange],
	)
	switch (control) {
		case ControlType.Textbox:
			return (
				<TextField
					key={`textfield-${key}`}
					label={label}
					value={value}
					onChange={handleTextChange}
				/>
			)
		case ControlType.Dropdown:
			if (!params?.options) {
				throw new Error('Dropdown control type requires list of options')
			}
			return (
				<Dropdown
					key={`dropdown-${key}`}
					label={label}
					selectedKeys={value}
					options={params.options.map((opt) => ({
						key: opt,
						text: opt,
					}))}
					onChange={handleOptionChange}
				/>
			)
		case ControlType.Checkbox:
			if (!params?.options) {
				throw new Error('Checkbox list control type requires list of options')
			}
			return (
				<div style={checkboxesStyle}>
					<Label>{label}</Label>
					{params.options.map(opt => (
					<Checkbox
					key={`checkbox-${key}-${opt}`}
					label={opt}
					checked={!!value?.find((v: any) => v === opt)}
					onChange={(_e, chk) => handleCheckChange(opt, chk)}
				/>))}
				</div>
				
			)
		default:
			throw new Error(
				`Unsupported control type ${JSON.stringify(control)} for ${type}`,
			)
	}
}
