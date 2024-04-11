/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Footer } from './Footer.js'
import type { FooterProps } from './Footer.types.js'
import { useCallback } from 'react'

const meta = {
	title: '@essex:components/Footer',
	component: Footer,
}

export default meta

const PrimaryComponent: React.FC<FooterProps> = (args) => {
	const testFunction = useCallback(() => {
		alert("Test call")
	}, [])

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<Footer
				{...args}
				links={[
					{
						name: 'Privacy & Cookies',
						href: ' https://go.microsoft.com/fwlink/?LinkId=521839',
					},
					{
						name: 'Consumer Health Privacy',
						href: 'https://go.microsoft.com/fwlink/?LinkId=2259814',
					},
					{
						name: 'Manage Cookies',
						onClick: testFunction,
						hide: false,
					},
					{
						name: 'Terms of Use',
						href: 'https://go.microsoft.com/fwlink/?LinkID=206977',
					},
					{
						name: 'Trademarks',
						href: 'https://www.microsoft.com/trademarks',
					},
					{
						name: `©️ ${new Date().getFullYear()} Microsoft`,
						href: 'https://www.microsoft.com',
					},
					{
						name: 'Github',
						href: 'https://github.com/microsoft/essex-toolkit',
					},
				]}
			/>
		</div>
	)
}

export const Primary = {
	render: (args: FooterProps) => <PrimaryComponent {...args} />,
}
