/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
     * 
     */
    selectedKey: string
}