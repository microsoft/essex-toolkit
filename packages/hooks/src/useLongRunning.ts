/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

const NONE: unknown[] = []

/**
 * A hook which invokes a long running task, and provides a loading flag
 * @param execute The long running task
 * @param delay The delay before running the long running task (this gives react time to render a loading bar before executing the task)
 * @param deps The optional list of dependencies
 * @returns A loading flag and the output of the long running task
 */
export function useLongRunning<T>(
	execute: () => T,
	delay = 100,
	deps: unknown[] = NONE,
): [boolean, T | undefined] {
	const [loading, setLoading] = useState(true)
	const [output, setOutput] = useState<T | undefined>()
	useEffect(() => {
		setLoading(true)
		setTimeout(() => {
			const newOutput = execute()
			setOutput(newOutput)
			setLoading(false)
		}, delay)
	}, [delay, execute, ...deps])
	return [loading, output] as [boolean, T | undefined]
}
