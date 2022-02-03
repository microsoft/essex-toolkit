/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link } from '@fluentui/react'
import { useCallback, useState, memo } from 'react'

export interface ToggleLinkProps {
	messages: [string, string]
	onChange?: (toggled: boolean) => void
	style?: React.CSSProperties
	className?: string
}

/**
 * Presents a hyperlink that toggles between two messages, like a toggle button.
 */
export const ToggleLink: React.FC<ToggleLinkProps> = memo(function ToggleLink({
	messages,
	onChange,
	style,
	className,
}) {
	const [toggled, setToggled] = useState<boolean>(false)
	const handleChange = useCallback(
		(t: boolean) => {
			setToggled(t)
			if (onChange) {
				onChange(t)
			}
		},
		[onChange],
	)
	return (
		<div style={style} className={className}>
			<Link onClick={() => handleChange(!toggled)}>
				{toggled ? messages[1] : messages[0]}
			</Link>
		</div>
	)
})
