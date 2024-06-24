/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { deferred } from '../deferred.js'

describe('deferred', () => {
	it('should not crash when creating a deferred', () => {
		const instance = deferred()
		expect(instance).toBeDefined()
	})

	describe('promise', () => {
		it('should return a promise that resolves correctly when resolved', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]

			void instance.resolve(expectedArgs)

			const promise = instance.promise
			return promise.then((args) => {
				expect(args).toEqual(expectedArgs)
			})
		})
		it('should return a promise that does not have the resolve function on it', () => {
			const instance = deferred()
			const promise = instance.promise
			expect((promise as any)['resolve']).toBeUndefined()
		})
	})
	describe('resolve', () => {
		it('should pass the correct args to the .then callback', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]

			return new Promise<void>((resolve) => {
				void instance.promise.then((args) => {
					expect(args).toEqual(expectedArgs)
					resolve()
				})

				// Resolve the initial promise
				void instance.resolve(expectedArgs)
			})
		})
		it('should return a promise when called', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]
			return instance.resolve(expectedArgs).then((args) => {
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
						() => {
							reject('This promise should not have been resolved')
						},
						(args) => {
							expect(args).toEqual(expectedArgs)
							resolve()
						},
					)
					.catch(() => {
						// do nothing?
					})

				// Resolve the reject promise
				void instance.reject(expectedArgs)
			})
		})
		it('should return a promise when called', async () => {
			const instance = deferred()
			const expectedArgs = [1, 2]
			return new Promise<void>((resolve, reject) => {
				instance.reject(expectedArgs).then(
					() => {
						reject('This promise should not have been resolved')
					},
					(args) => {
						expect(args).toEqual(expectedArgs)
						resolve()
					},
				)
			})
		})
	})
})
