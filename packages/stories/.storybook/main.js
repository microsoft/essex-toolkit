/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { configure } from '@essex/storybook-config/main'
const path = require('path')

module.exports = configure({
	staticDirs: [path.join(__dirname, '../public')],
})