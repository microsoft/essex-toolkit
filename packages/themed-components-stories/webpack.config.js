/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/webpack-config')
const base = configure({ pnp: true })

const lineupRules = [
	{
		test: /\.svg(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: 'url-loader',
		options: {
			limit: 10000, //inline <= 10kb
			mimetype: 'image/svg+xml',
		},
	},
	{
		test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: 'file-loader',
	},
]

base.module.rules = [...base.module.rules, ...lineupRules]

module.exports = base
