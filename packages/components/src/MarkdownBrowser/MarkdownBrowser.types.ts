/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from "@fluentui/react"
import type { CSSProperties } from "react"

export interface MarkdownBrowserStyles {
    /**
     * Styles for the outer container of the component.
     */
    root?: CSSProperties
    /**
     * Styles for the navigation buttons.
     * By default these are absolutely positioned in the top-right corner.
     */
    navigation?: CSSProperties
    /**
     * Styles for the markdown content container.
     * Note that React CSSProperties do not support nested elements,
     * so if you want to override our default header and table conventions,
     * create an inline style that wraps the component.
     */
    markdown?: CSSProperties
}

export interface MarkdownBrowserProps {
    /**
     * Map of content with:
     * key: The content key (typically relative filename).
     * content: The markdown content to render.
     * 
     * Relative paths in hyperlinks will be checked for content to navigate to.
     * Fully-qualified paths (e.g., URLs) will be opened in a new window/tab.
     */
    content: Record<string, string>
    /**
     * Key for the default 'home' content to render.
     */
    home: string,
    styles?: MarkdownBrowserStyles
    backButtonProps?: IButtonProps
    homeButtonProps?: IButtonProps
}