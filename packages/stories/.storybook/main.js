/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require('path')
const { configure } = require('@essex/storybook-config/main')

module.exports = configure({
	staticDirs: [path.join(__dirname, '../public')],
	transpileMatch: [/@essex\/storybook-config/]
})