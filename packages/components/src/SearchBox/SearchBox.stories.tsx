/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox as SearchBoxComponent } from '@essex/components'

const meta = {
	title: '@essex:components/SearchBox',
}

export default meta

/**
 * SearchBoxStory is a SearchBox based on
 * Fluent Component
 * adapted for Thematic styling
 */
export const SearchBox = () => {
	return <SearchBoxComponent label={'Label'} placeholder={'placeholder'} />
}
