/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox } from '@essex/themed-components'

const meta = {
	title: 'SearchBox',
}

export default meta

/**
 * SearchBoxStory is a SearchBox based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const SearchBoxStory: CSF = () => {
	return <SearchBox label={'Label'} placeholder={'placeholder'} />
}

SearchBoxStory.story = {
	name: 'SearchBox',
}
