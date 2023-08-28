/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, IconButton } from '@fluentui/react'
import { memo } from 'react'

import { useCloseIconProps } from './ToolPanel.hooks.js'
import { useStyles } from './ToolPanel.styles.js'
import type { ToolPanelProps } from './ToolPanel.types.js'

export const ToolPanel: React.FC<React.PropsWithChildren<ToolPanelProps>> =
	memo(function ToolPanel({
		onDismiss,
		headerText,
		headerIconProps,
		hasCloseButton = true,
		closeIconProps,
		styles,
		children,
	}) {
		const closeProps = useCloseIconProps(closeIconProps)
		const _styles = useStyles(styles)
		return (
			<div style={_styles?.root}>
				<div style={_styles?.header}>
					<div style={_styles.titleContainer}>
						{headerIconProps && <Icon {...headerIconProps} />}
						<h3 style={_styles?.title}>{headerText}</h3>
					</div>
					{hasCloseButton && (
						<IconButton
							iconProps={closeProps}
							onClick={onDismiss}
							ariaLabel='Close'
						/>
					)}
				</div>
				<div style={_styles?.content}>{children}</div>
			</div>
		)
	})
