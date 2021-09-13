/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	stories: ['../src/**/*.stories.ts*'],
	addons: [
		require.resolve('@storybook/addon-actions'),
		require.resolve('@storybook/addon-links'),
		require.resolve('@storybook/addon-knobs'),
		require.resolve('@storybook/addon-a11y'),
	],
	webpackFinal: async (config, { configType }) => {
		// `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
		// You can change the configuration based on that.
		// 'PRODUCTION' is used when building the static version of storybook.

		// here we use babel-loader
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			loader: require.resolve('babel-loader'),
			options: {
				babelrc: false,
				presets: [
					require.resolve('@babel/preset-typescript'),
					require.resolve('@babel/preset-env'),
					[
						require.resolve('@babel/preset-react'),
						{
							runtime: 'automatic',
						},
					],
				],
				plugins: [require.resolve('babel-plugin-styled-components')],
			},
		}),
			config.resolve.extensions.push('.ts', '.tsx'),
			(config.stats = 'verbose')

		// Return the altered config
		return config
	},
}
