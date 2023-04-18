/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const containerStyle = {
	display: 'flex',
	flexDirection: 'column' as const,
	gap: 8,
}

export const groupContainerStyle = {
	display: 'flex',
	flexDirection: 'column' as const,
	gap: 20,
}

export const toggleStyles = {
	root: {
		marginBottom: 0,
	},
}

export const checkboxStyles = {
	label: {
		// this is to match the overall label styling of the other controls, which is always bold
		fontWeight: 'bold',
	},
}
