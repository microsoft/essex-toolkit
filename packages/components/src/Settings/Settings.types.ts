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

export interface SettingsGroup {
	keys: string[]
	label?: string
}

export interface SettingsProps {
	/**
	 * Required object to render into a settings panel.
	 * This can be basically anything, but should be flat
	 * at the moment, as complex/nest objects are not supported.
	 */
	settings: any
	/**
	 * Map of optional config params for individual settings.
	 * The key should match the key present in the settings object.
	 */
	config?: { [key: string]: SettingConfig }
	/**
	 * List of optional groups to sort the settings into, with a separator between each.
	 * The group is a list of the keys to include, with an optional label for the separator.
	 */
	groups?: SettingsGroup[]
	/**
	 * Handler to notify when any of the settings has changed.
	 * Callback args will be the key and value that changed.
	 * Merging, etc. is up to the consumer.
	 *
	 */
	onChange?: (key: string, value: any) => void
}
