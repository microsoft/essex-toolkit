/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Expando as ExpandoComponent } from './Expando.js'
import type { ExpandoProps } from './Expando.types.js'

const storyMetadata = {
	title: '@essex:components/Expando',
	component: ExpandoComponent,
}
export default storyMetadata

const Template = (args: ExpandoProps) => (
	<ExpandoComponent {...args}>Here is the child content!</ExpandoComponent>
)

export const Expando = Template.bind({}) as any as { args: ExpandoProps }

Expando.args = {
	label: 'More...',
	defaultExpanded: false,
}
