/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configure } from '@essex/storybook-config/main'
import path from 'path'

export default configure({
	stories: ['../about.mdx', '../../*/src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
	staticDirs: [path.join(__dirname, '../public')],
})
