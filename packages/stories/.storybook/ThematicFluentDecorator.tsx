/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons, Toggle } from '@fluentui/react'
import { loadById } from '@thematic/core'
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import { useCallback, useMemo, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'

initializeIcons()
/**
 * ThematicFluentDecorator configures both Thematic and the Fluent wrapper
 * @param storyFn
 */
export const ThematicFluentDecorator = (storyFn: any) => {
	const [dark, setDark] = useState(false)
	// load a non-standard theme, so it is obvious that it isn't the default
	// this helps identify problems with theme application in Fluent, which looks a lot like our default essex theme
	const thematicTheme = useMemo(
		() =>
			loadById('autumn', {
				dark,
			}),
		[dark],
	)
	const fluentTheme = useMemo(
		() => loadFluentTheme(thematicTheme),
		[thematicTheme],
	)
	const handleDarkChange = useCallback(
		(_e: unknown, v: boolean | undefined) => {
			setDark(v ?? false)
		},
		[],
	)
	return (
		<ThematicFluentProvider theme={thematicTheme}>
			<style>
				{`* {
					box-sizing: border-box;
				}`}
			</style>
			<ApplicationStyles />
			<Toggle label="Dark mode" checked={dark} onChange={handleDarkChange} />
			<ThemeProvider theme={fluentTheme}>
				<Container>{storyFn(undefined, undefined)}</Container>
			</ThemeProvider>
		</ThematicFluentProvider>
	)
}

const Container = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
