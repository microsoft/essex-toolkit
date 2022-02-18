const ResolveTypescriptPlugin = require('resolve-typescript-plugin')

module.exports = {
	stories: ['../src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		//'@storybook/addon-a11y',
	],
	webpackFinal: async (config, { configType }) => {
		if (!config.resolve) {
			config.resolve = {}
		}
		if (!config.resolve.plugins) {
			config.resolve.plugins = []
		}
		config.resolve.plugins.push(new ResolveTypescriptPlugin())

		return config
	},
}
