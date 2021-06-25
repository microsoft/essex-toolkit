/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import * as React from 'react'

import { CollapsiblePanelContainerProps } from './interfaces'

export const CollapsiblePanelContainer: React.FC<CollapsiblePanelContainerProps> =
	({ children }) => {
		const countChildren = React.Children.count(children)
		const rendered = useMemo(() => {
			return React.Children.map(children, (child: any, index: number) =>
				React.cloneElement(child, {
					first: index === 0,
					last: countChildren === index - 1,
				}),
			)
		}, [children])

		return <div>{rendered}</div>
	}
