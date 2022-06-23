/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { addDecorator } from '@storybook/react'
import { ThematicFluentDecorator } from './ThematicFluentDecorator'
import { loadCSV } from 'arquero'

addDecorator(ThematicFluentDecorator)

export const loaders = [
	async () => ({
		stocks: await loadCSV('./data/stocks.csv', {
			autoMax: 1000000,
		}),
	}),
]
