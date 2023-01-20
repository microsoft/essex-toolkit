/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import Markdown from 'markdown-to-jsx'
import { memo, useRef } from 'react'

import {
    useHistory,
	useIndexed,
    useLinkNavigation,
} from './MarkdownBrowser.hooks.js'
import { Container, Navigation, useIconButtonProps } from './MarkdownBrowser.styles.js'
import type { MarkdownBrowserProps } from './MarkdownBrowser.types.js'

/**
 * A component for rendering markdown.
 */
export const MarkdownBrowser: React.FC<MarkdownBrowserProps> = memo(function MarkdownBrowser({
	selectedKey,
	content,
}) {
	const container = useRef<HTMLDivElement>(null)
	const index = useIndexed(content)
    const {
        current,
        goHome,
        goBack,
        goForward
    } = useHistory(selectedKey)
    
    useLinkNavigation(container, goForward, current)

    const md = index(current)
    
    const backProps = useIconButtonProps('Back', goBack)
    const homeProps = useIconButtonProps('Home', goHome)
	return (
		<Container ref={container}>
			<Navigation>
					<IconButton {...backProps} />
					<IconButton {...homeProps} />
			</Navigation>
			<Markdown>{md}</Markdown>
		</Container>
	)
})