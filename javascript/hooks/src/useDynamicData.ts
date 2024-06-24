/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { delay } from '@essex/toolbox'
import { useLayoutEffect, useMemo, useState } from 'react'

import type { DynamicData } from './interfaces/index.js'

/**
 * A interface for dynamic data
 */

/**
 * Hook which allows for the use of a dynamic data source
 * @param values - The raw set of values, or an iterator to get the values
 * @param map - An optional mapping function which takes a list of values and transforms them
 * @param deps - The optional list of dependencies to use when updating the values
 * @returns The last value from the iterator
 */
export function useDynamicData<InputType, OutputType = InputType>(
	values?: DynamicData<InputType>,
	map?: (values: InputType) => OutputType,
	deps: any[] = [],
): OutputType | undefined {
	const [state, setState] = useState(undefined as OutputType | undefined)
	useLayoutEffect(() => {
		let done = false
		if (values) {
			if (typeof (values as any)[Symbol.asyncIterator] === 'function') {
				setTimeout(async () => {
					for await (const value of values as any as AsyncIterable<InputType>) {
						if (!done) {
							setState(value as any)
							await delay(50)
						} else {
							break
						}
					}
				}, 0)
			} else {
				setState(values as any as OutputType)
			}
		} else {
			setState(undefined)
		}
		return () => {
			done = true
		}
	}, [values, ...deps])
	const memod = useMemo<OutputType | undefined>(() => {
		if (map) {
			return map(state as any)
		}
		return state
	}, [state, map])
	return memod
}
