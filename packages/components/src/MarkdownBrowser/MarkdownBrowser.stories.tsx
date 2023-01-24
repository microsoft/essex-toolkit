/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import { useState } from 'react'

import { MarkdownBrowser } from './MarkdownBrowser.js'
import type { MarkdownBrowserProps } from './MarkdownBrowser.types.js'

const meta = {
	title: '@essex:components/MarkdownBrowser',
	component: MarkdownBrowser,
}
export default meta

const content = {
	aggregate: `
# aggregate

Link to [groupby](./groupby.md) and [fill](./fill.md) to support all-in-one data aggregations.

## Example

| id  | value |
| --- | ----- |
| 1   | 10    |
| 1   | 15    |
| 2   | 1     |
| 2   | 11    |
| 2   | 18    |

\`aggregate column['value'] with function='sum', groupby=column['id'], t_column='output'\`:

| id  | output |
| --- | ------ |
| 1   | 25     |
| 2   | 30     |

[no header](./noheader.md)

We can also link to [external](https://en.wikipedia.org/wiki/Markdown) content.
`,
	groupby: `
# groupby

Groups table rows using keys from a specified column list. Note that this is an underlying index on a table that isn't necessarily visible, but will apply when performing operations that are sensitive to grouping. See [aggregate](./aggregate.md) for examples of \`groupby\`.

Here is a [missing link](./missing.md).
`,
	fill: `
# fill

Creates a new output column and fills it with a fixed value.

## Example

| id  |
| --- |
| 1   |
| 2   |
| 3   |

\`fill column='output' with value='hi'\`:

| id  | output |
| --- | ------ |
| 1   | hi     |
| 2   | hi     |
| 3   | hi     |

`,
	noheader: `
This content has no header so we can see how the alignment works with the navigation buttons

## Example

| id  |
| --- |
| 1   |
| 2   |
| 3   |

Here is a [missing link](./missing.md).

\`fill column='output' with value='hi'\`:

| id  | output |
| --- | ------ |
| 1   | hi     |
| 2   | hi     |
| 3   | hi     |

`,
}

const Template: ComponentStory<typeof MarkdownBrowser> = (
	args: MarkdownBrowserProps,
) => {
	const [home, setHome] = useState<string | undefined>('aggregate')

	return (
		<div>
			<div
				style={{
					display: 'flex',
					gap: 8,
					marginBottom: 8,
				}}
			>
				<DefaultButton onClick={() => setHome('aggregate')}>
					aggregate
				</DefaultButton>
				<DefaultButton onClick={() => setHome('groupby')}>
					groupby
				</DefaultButton>
				<DefaultButton onClick={() => setHome(undefined)}>clear</DefaultButton>
			</div>
			<div
				style={{
					width: 600,
					height: 400,
					padding: 12,
					border: '1px solid orange',
				}}
			>
				<MarkdownBrowser {...args} content={content} home={home} />
			</div>
		</div>
	)
}

export const Primary = Template.bind({})

export const Customized = Template.bind({})
Customized.args = {
	styles: {
		root: {
			border: '1px solid dodgerblue',
			padding: 20,
		},
		markdown: {
			fontFamily: 'monospace',
		},
	},
	homeButtonProps: {
		iconProps: {
			iconName: 'RedEye',
		},
	},
	backButtonProps: {
		iconProps: {
			iconName: 'Undo',
		},
	},
}
