/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface SettingsProps {
	/**
	 * Settings object to render into a settings panel.
	 * This can be basically anything, but should be flat
	 * at the moment, as complex/nested objects are not supported.
	 * Note that this can be undefined if a config is supplied.
	 */
	settings?: any
	/**
	 * Map of optional config params for individual settings.
	 * The key should match the key present in the settings object.
	 * If an item in this config does not exist in the settings,
	 * it must use a defaultValue so we can initialize it.
	 */
	config?: SettingsConfig
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

/**
 * Map of specific configs for settings.
 * Settings that do not have a config will be auto-configured.
 */
export type SettingsConfig = Record<string, SettingConfig>

/**
 * Config options for a particular setting,
 * to override default control behaviors.
 */
export interface SettingConfig {
	/**
	 * Custom label to use instead of deriving from the setting key.
	 */
	label?: string
	/**
	 * Explicitly set the data type, overriding typeof.
	 * Useful when the default value is undefined so type cannot be inferred.
	 */
	type?: DataType
	/**
	 * Explicitly set the control to display instead of the default guess.
	 */
	control?: ControlType
	/**
	 * Default value of the setting.
	 */
	defaultValue?: any
	/**
	 * Deeper params for controls that may need extra config (e.g., numeric bounds).
	 */
	params?: ControlParams
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

export enum DataType {
	String = 'string',
	Number = 'number',
	Boolean = 'boolean',
	Array = 'array'
}

/**
 * Type of control you'd like rendered for a setting.
 * This uses traditional names but maps to controls available in the Fluent control set.
 * E.g., 'textbox' is a Textfield.
 */
export enum ControlType {
	Textbox = 'textbox',
	Spinner = 'spinner',
	Toggle = 'toggle',
	// optional advanced control specs
	Dropdown = 'dropdown',
	Radio = 'radio',
	Slider = 'slider',
	Checkbox = 'checkbox',
}

/**
 * Groupings for settings items.
 * Groups consist of a label and the list of keys of the settings to put in the group.
 * Ungrouped settings will be placed at the top with no group label.
 */
export interface SettingsGroup {
	keys: string[]
	label?: string
}

// the following types are used internally and not exported from the lib
/**
 * Internal full config options for a control.
 * This is populated by parsing a raw object,
 * then overlaying any specific configs defined by consumers.
 */
export interface ParsedSettingConfig extends SettingConfig {
	key: string
	value: any
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
