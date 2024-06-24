/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PropsWithChildren } from 'react'
import { Children, cloneElement, useMemo } from 'react'

import type { CollapsiblePanelContainerProps } from './CollapsiblePanel.types.js'

/**
 * Receives an array of CollapsiblePanel as children to render it
 * with first and last props calculating it automatically
 */
export const CollapsiblePanelContainer: React.FC<
	PropsWithChildren<CollapsiblePanelContainerProps>
> = ({ styles, children }) => {
	const countChildren = Children.count(children)
	const rendered = useMemo(() => {
		return Children.map(children, (child: any, index: number) =>
			cloneElement(child, {
				first: index === 0,
				last: countChildren === index - 1,
			}),
		)
	}, [children, countChildren])

	return <div style={styles?.root}>{rendered}</div>
}
