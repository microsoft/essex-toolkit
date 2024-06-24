/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps, ILinkProps } from '@fluentui/react'
import type { CSSProperties } from 'react'

export interface ExpandoStyles {
	/**
	 * Root container.
	 */
	root?: CSSProperties
	/**
	 * Expando container - i.e., the toggle icon and link.
	 */
	expando?: CSSProperties
	/**
	 * Content container - the panel displayed with child content once expanded.
	 */
	content?: CSSProperties
}

export interface ExpandoProps {
	/**
	 * Toggle link label text.
	 */
	label: string
	/**
	 * Whether to expand the container by default.
	 */
	defaultExpanded?: boolean
	/**
	 * Props to customize the open/close chevron.
	 * Note that the default switches the orientation of the chevron,
	 * overriding these will lose that state switch.
	 */
	iconButtonProps?: IButtonProps
	/**
	 * Custom props for the link label.
	 */
	linkProps?: ILinkProps
	/**
	 * Custom styles for the component.
	 */
	styles?: ExpandoStyles
}
