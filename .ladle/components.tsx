import { useMemo } from 'react'
import { ThemeVariant, loadById } from '@thematic/core'
import { ApplicationStyles } from '@thematic/react'
import { ThematicFluentProvider } from '@thematic/fluent'
import type { GlobalProvider } from '@ladle/react'

/**
 * Providers configures both Thematic and the Fluent wrapper
 * We load a non-standard theme, so it is obvious that it isn't the default.
 * This helps identify problems with theme application in Fluent, which looks a lot like our default essex theme (similar blue)
 */
export const Provider: GlobalProvider = ({ children, globalState }) => {
	const thematicTheme = useMemo(
		() =>
			loadById('ocean', {
				variant:
					globalState.theme === 'dark' ? ThemeVariant.Dark : ThemeVariant.Light,
			}),
		[globalState],
	)
	return (
		<ThematicFluentProvider theme={thematicTheme}>
			<ApplicationStyles />
			<div
				style={{
					border: `1px solid ${thematicTheme.application().border().hex()}`,
					padding: 20,
				}}
			>
				{children}
			</div>
		</ThematicFluentProvider>
	)
}
