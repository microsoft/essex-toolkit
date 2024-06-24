/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export * from '@essex/storybook-config/preview'

export const parameters = {
	docs: {
		components: {
			a: ({ children, ...args }) => (
				<a style={{ color: 'red' }} {...args}>
					{children}
				</a>
			),
		},
	},
}
