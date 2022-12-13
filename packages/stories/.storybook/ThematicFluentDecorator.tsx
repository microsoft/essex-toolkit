import { useState, useCallback, useMemo } from 'react'
import { initializeIcons, Toggle } from '@fluentui/react'
import { loadById } from '@thematic/core'
import { ApplicationStyles } from '@thematic/react'
import { ThematicFluentProvider } from '@thematic/fluent'
import { StoryFnReactReturnType } from '@storybook/react/dist/ts3.9/client/preview/types'
import styled, { ThemeProvider } from 'styled-components'

initializeIcons()
/**
 * ThematicFluentDecorator configures both Thematic and the Fluent wrapper
 * @param storyFn
 */
export const ThematicFluentDecorator = (
	storyFn: any,
): StoryFnReactReturnType => {
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

	const handleDarkChange = useCallback((e, v) => {
		setDark(v)
	}, [])
	return (
		<ThematicFluentProvider theme={thematicTheme}>
			<style>
				{`* {
					box-sizing: border-box;
				}`}
			</style>
			<ApplicationStyles />
			<Toggle label="Dark mode" checked={dark} onChange={handleDarkChange} />
			<ThemeProvider theme={thematicTheme}>
				<Container>{storyFn(undefined, undefined)}</Container>
			</ThemeProvider>
		</ThematicFluentProvider>
	)
}

const Container = styled.div`
	padding: 20px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
