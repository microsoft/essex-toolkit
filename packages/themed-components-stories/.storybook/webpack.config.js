const path = require('path')
/**
 * Webpack config to provide rules for proper storybook running
 * If you run into issues, try removing the config.resolve.alias
 * or running yarn build after removing any previous build files
 * Then restart storybook
 */
module.exports = ({ config, mode }) => {
	const isDev = mode.toLowerCase() !== 'production'
	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		use: [
			{
				loader: require.resolve('babel-loader'),
				options: {
					presets: [
						[
							'@babel/preset-env',
							{
								modules: false,
								targets: {
									browsers: ['last 2 Chrome versions'],
								},
								useBuiltIns: false,
							},
						],
					],
					plugins: [
						'@babel/proposal-class-properties',
						'@babel/proposal-object-rest-spread',
						'@babel/plugin-proposal-optional-chaining',
					],
				},
			},
			{
				loader: require.resolve('awesome-typescript-loader'),
			},
			{
				loader: require.resolve('react-docgen-typescript-loader'),
			},
		],
	})

	config.resolve.extensions.push('.ts', '.tsx')

	if (isDev) {
		config.devtool = 'eval'
	}
	config.resolve.alias = {
		react: path.resolve(require.resolve('react')),
	}

	return config
}
