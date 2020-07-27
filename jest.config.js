/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	collectCoverageFrom: [
		'packages/*/src/**/*.{js,jsx,ts,tsx}',
		'!**/node_modules/**',
		'!**/vendor/**',
		'!**/dist/**',
		'!**/lib/**',
		'!**/site/**',
		'!**/assets/**',
		'!**/__tests__/**',
	],
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.jest.json',
		},
	},
	coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
	testMatch: ['**/src/**/*.spec.[jt]s?(x)'],
}
