<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@essex/components](./components.md) &gt; [MarkdownBrowserProps](./components.markdownbrowserprops.md)

## MarkdownBrowserProps interface

<b>Signature:</b>

```typescript
export interface MarkdownBrowserProps 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [backButtonProps?](./components.markdownbrowserprops.backbuttonprops.md) |  | IButtonProps | <i>(Optional)</i> |
|  [content](./components.markdownbrowserprops.content.md) |  | Record&lt;string, string&gt; | <p>Map of content with: key: The content key (typically relative filename). content: The markdown content to render.</p><p>Relative paths in hyperlinks will be checked for content to navigate to. Fully-qualified paths (e.g., URLs) will be opened in a new window/tab.</p> |
|  [home?](./components.markdownbrowserprops.home.md) |  | string | <i>(Optional)</i> Key for the default 'home' content to render. |
|  [homeButtonProps?](./components.markdownbrowserprops.homebuttonprops.md) |  | IButtonProps | <i>(Optional)</i> |
|  [styles?](./components.markdownbrowserprops.styles.md) |  | [MarkdownBrowserStyles](./components.markdownbrowserstyles.md) | <i>(Optional)</i> |
