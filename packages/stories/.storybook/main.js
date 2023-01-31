/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ResolveTypescriptPlugin from 'resolve-typescript-plugin'
const path = require('path')

const SWC_CONFIG = {
	sourceMaps: true,
	jsc: {
		target: 'es2021',
		parser: {
			syntax: 'typescript',
			tsx: true,
			decorators: true,
			dynamicImport: true,
			importAssertions: true,
		},
		experimental: {
			keepImportAssertions: true,
		},
		transform: {
			react: { runtime: 'automatic', useBuiltins: true },
		},
	},
}

module.exports = {
	stories: ['../../*/src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
	staticDirs: [path.join(__dirname, '../public')],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			compilerOptions: {
				allowSyntheticDefaultImports: false,
				esModuleInterop: false,
			},
		},
	},
	webpackFinal(config) {
		config.resolve.plugins = [
			...(config.resolve.plugins ?? []),
			new ResolveTypescriptPlugin(),
		]

		// Swap out babel w/ swc for transpiling app-assets
		const babelRule = config.module.rules[2]
		config.module.rules.splice(2, 1, {
			test: /\.(cjs|mjs|jsx?|cts|mts|tsx?)$/,
			loader: require.resolve('swc-loader'),
			options: SWC_CONFIG,
			include: babelRule.include,
			exclude: babelRule.exclude,
		})
		return config
	},
	docs: {
		autodocs: true,
	},
}
