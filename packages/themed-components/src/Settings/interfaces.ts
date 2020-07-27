/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Type of control you'd like rendered for a setting.
 * This uses traditional names,
 * but maps to controls available in the
 * Fluent control set.
 * E.g., 'textbox' is a Textfield.
 */

export enum ControlType {
	textbox = 'textbox',
	spinner = 'spinner',
	toggle = 'toggle',
	// optional advanced control specs
	dropdown = 'dropdown',
	radio = 'radio',
	slider = 'slider',
	checkbox = 'checkbox',
}

/**
 * These are optional params to supply
 * detailed config for controls that allow it.
 * This could potentially support a wide range of
 * options, but if so should be more strongly typed.
 */
export interface ControlParams {
	/**
	 * Min numeric range, e.g., for slider or spinner
	 */
	min?: number
	/**
	 * Max numeric range, e.g., for slider or spinner
	 */
	max?: number
	/**
	 * Numeric step increment, e.g., for slider or spinner
	 */
	step?: number
	/**
	 * List of selectable options, e.g., for dropdown or radio.
	 */
	options?: string[]
}

/**
 * Config options for a particular setting,
 * to override default control behaviors.
 */
export interface SettingConfig {
	label?: string
	control?: ControlType
	params?: ControlParams
}

export interface SettingsI extends SettingConfig {
	[key: string]: any
}

/**
 * Internal full config options for a control.
 * This is populated by parsing a raw object,
 * then overlaying any specific configs defined by consumers.
 */
export interface ParsedSettingConfig extends SettingConfig {
	key: string
	value: any
	type: string
}

export interface SortedSettingsGrouped extends ParsedSettingConfig {
	separator: boolean
	settings: any[]
}
export interface SortedSettings {
	settings: ParsedSettingConfig[]
}
/**
 * Internal props used for all of the controls.
 */
export interface ControlProps {
	config: ParsedSettingConfig
	onChange?: (key: string, value: any) => void
}
