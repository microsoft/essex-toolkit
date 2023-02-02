/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { addons } from '@storybook/addons'
import { create } from '@storybook/theming'

const theme = create({
	base: 'light',

	// Typography
	fontBase: '"Open Sans", sans-serif',
	fontCode: 'monospace',

	// Text colors
	// Note: using recommended colors from Accessibility Insights to clear FastPass check
	textColor: '#67747e',
	textMutedColor: '#67747e',
	// textColor: '#dddddd',
	textInverseColor: '#5675aa',
	inputTextColor: '#67747e',

	brandTitle: 'Essex Toolkit',
	brandUrl: 'https://github.com/microsoft/essex-toolkit',
	// brandImage: 'https://place-hold.it/350x150',
	brandTarget: 'microsoft.com',
})

addons.setConfig({
	theme,
})
