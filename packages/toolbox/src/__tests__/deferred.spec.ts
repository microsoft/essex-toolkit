/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { deferred } from '../deferred'

describe('deferred', () => {
	it('should not crash when creating a deferred', () => {
		const instance = deferred()
		expect(instance).toBeDefined()
	})

	describe('promise', () => {
		it('should return a promise that resolves correctly when resolved', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]

			instance.resolve(expectedArgs)

			const promise = instance.promise
			return promise.then(args => {
				expect(args).toEqual(expectedArgs)
			})
		})
		it('should return a promise that does not have the resolve function on it', async () => {
			const instance = deferred()
			const promise = instance.promise
			expect((promise as any)['resolve']).toBeUndefined()
		})
	})
	describe('resolve', () => {
		it('should pass the correct args to the .then callback', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]

			return new Promise<void>(resolve => {
				instance.promise.then(args => {
					expect(args).toEqual(expectedArgs)
					resolve()
				})

				// Resolve the initial promise
				instance.resolve(expectedArgs)
			})
		})
		it('should return a promise when called', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]
			return instance.resolve(expectedArgs).then(args => {
				expect(args).toEqual(expectedArgs)
			})
		})
	})
	describe('reject', () => {
		it('should pass the correct args to the .then callback', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]
			return new Promise<void>((resolve, reject) => {
				instance.promise
					.then(
						args => {
							reject('This promise should not have been resolved')
						},
						args => {
							/* eslint-disable-next-line jest/no-conditional-expect */
							expect(args).toEqual(expectedArgs)
							resolve()
						},
					)
					.catch(() => {
						// do nothing?
					})

				// Resolve the reject promise
				instance.reject(expectedArgs)
			})
		})
		it('should return a promise when called', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]
			return new Promise<void>((resolve, reject) => {
				instance.reject(expectedArgs).then(
					args => {
						reject('This promise should not have been resolved')
					},
					args => {
						expect(args).toEqual(expectedArgs)
						resolve()
					},
				)
			})
		})
	})
})
