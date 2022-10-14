/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ClippedGraph } from '@essex/components'

const story = {
	title: '@essex:components/ClippedGraph',
}
export default story
const data = [
	1, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 5, 4, 5, 6, 5, 6, 5, 4, 3, 4, 3, 2, 25,
	89, 30, 12, 3, 2, 3, 4, 3, 6, 7, 8, 7, 8, 7, 8, 7, 8, 9, 8, 9, 8, 7, 6, 7, 6,
	5, 6,
]

const WIDTH = 800
const HEIGHT = 100

const wrapper: React.CSSProperties = {
	width: WIDTH,
	height: HEIGHT,
	marginBottom: 20,
}

/**
 * ClippedGraphStory contains react component to display charts larger than viewable area
 * It provides an alternative view of "clipped" chart area
 */
export const ClippedGraphStory = () => (
	<div>
		Full graph
		<div style={wrapper}>
			<ClippedGraph width={WIDTH} height={HEIGHT} data={data} />
		</div>
		Clipped graph
		<div style={wrapper}>
			<ClippedGraph
				width={WIDTH}
				height={HEIGHT}
				data={data}
				clipped
				gradient
			/>
		</div>
		Clipped horizon graph
		<div style={wrapper}>
			<ClippedGraph width={WIDTH} height={HEIGHT} data={data} horizon clipped />
		</div>
	</div>
)

ClippedGraphStory.storyName = 'main'
