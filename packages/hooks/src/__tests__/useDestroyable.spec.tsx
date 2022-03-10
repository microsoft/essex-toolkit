/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// Link.react.test.js
import { act, render } from '@testing-library/react'

import { useDestroyable } from '../useDestroyable.js'

/* eslint @typescript-eslint/no-unused-vars:0 */
const DestroyableTest = ({ destroyable }: any) => {
	const [usedDestroyable, setDestroyable] = useDestroyable()
	if (usedDestroyable !== destroyable) {
		setDestroyable(destroyable)
	}
	return null
}

/* eslint-disable jest/no-disabled-tests, jest/expect-expect */

test.skip('Setting an undefined destroyable does not cause a crash', () => {
	act(() => {
		render(<DestroyableTest destroyable={undefined}></DestroyableTest>)
	})
})
/* eslint-disable jest/no-disabled-tests */
test.skip('Setting a destroyable to undefined causes the original destroyable to be destroyed', async () => {
	return new Promise<void>((resolve, reject) => {
		act(() => {
			const destroyable = {
				destroy() {
					resolve()
				},
			}

			// First render with our destroyable
			const { rerender } = render(
				<DestroyableTest destroyable={destroyable}></DestroyableTest>,
			)

			// Then render again with nothing and make sure destroy is called
			rerender(<DestroyableTest destroyable={undefined}></DestroyableTest>)
		})
	})
})
/* eslint-disable jest/no-disabled-tests */
test.skip('Setting a destroyable to a different destroyable causes the original destroyable to be destroyed', async () => {
	return new Promise<void>((resolve, reject) => {
		act(() => {
			const destroyable1 = {
				destroy() {
					resolve()
				},
			}
			const destroyable2 = {
				destroy() {
					// This shouldn't be called
					reject()
				},
			}

			// First render with our destroyable
			const { rerender } = render(
				<DestroyableTest destroyable={destroyable1}></DestroyableTest>,
			)

			// Then render again with nothing and make sure destroy is called
			rerender(<DestroyableTest destroyable={destroyable2}></DestroyableTest>)
		})
	})
})
