/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ClippedGraph } from '@essex/themed-components'

import type { CSF } from './types'

const story = {
	title: 'ClippedGraph',
}
export default story
const data = [
	1, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 5, 4, 5, 6, 5, 6, 5, 4, 3, 4, 3, 2, 25,
	89, 30, 12, 3, 2, 3, 4, 3, 6, 7, 8, 7, 8, 7, 8, 7, 8, 9, 8, 9, 8, 7, 6, 7, 6,
	5, 6,
]

/**
 * ClippedGraphStory contains react component to display charts larger than viewable area
 * It provides an alternative view of "clipped" chart area
 */
export const ClippedGraphStory: CSF = () => (
	<div>
		Full graph
		<div style={{ width: 800, height: 100, marginBottom: 20 }}>
			<ClippedGraph width={800} height={100} data={data} />
		</div>
		Clipped graph
		<div style={{ width: 800, height: 100 }}>
			<ClippedGraph
				width={800}
				height={100}
				data={data}
				clipped={true}
				gradient={true}
			/>
		</div>
	</div>
)

ClippedGraphStory.story = {
	name: 'main',
}
