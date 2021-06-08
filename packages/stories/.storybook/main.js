/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	stories: ['../src/**/*.stories.ts*'],
	addons: [
		require.resolve('@storybook/addon-actions/register'),
		require.resolve('@storybook/addon-links/register'),
		require.resolve('@storybook/addon-knobs/register'),
		require.resolve('@storybook/addon-a11y/register'),
		require.resolve('@storybook/addon-docs/register'),
	],
}
