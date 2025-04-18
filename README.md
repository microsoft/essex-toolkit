# essex-toolkit

Provides a set of useful tools, utilities, reusable components, and React hooks built to support our team built library ecosystem.
Packages are designed to capture common components and utilities common among projects.
See individual package README for specific information.

## Python Packages

### [fnllm](python/fnllm/README.md)
An LLM wrapper library that provides rate limiting, retry logic, caching, JSON model parsing, and more.
### [reactivedataflow](python/reactivedataflow/README.md)
A library for creating reactive data flows in Python.

## JavaScript Packages

### [@essex/hooks](javascript/hooks/README.md)

Provides a set of useful react hooks to address common use-cases in webGL/canvas/svg applications

### [@essex/msal-interactor](javascript/msal-interactor/README.md)

A wrapper around [@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser).

### [@essex/hierarchy-browser](javascript/hierarchy-browser/README.md)

This component creates tables to view connected data, allowing theming with Thematic.

### [@essex/thematic-lineup](javascript/thematic-lineup/README.md)

This component uses the standard [LineUp.js](https://lineup.js.org/) table, and does (a) injection of Thematic, (b) cleans it up a little bit, and (c) adds a custom filtering mechanism
ThematicLineupStory displays a LineUp instance, while also applying default thematic styles and data colors.
Use it for a React-style JSX wrapper around LineUp that has more potential flexibility than the very configuration limited version exposed by the LineUp project.
This allows arbitrary column configurations via jsx, and a set of global filters if desired.

### [@essex/components](javascript/components/README.md)

Provides a set of React components
Works in harmony with Thematic library styling and contains ready-to-use data visuals

### [@essex/toolbox](javascript/toolbox/README.md)

Provides is a collection of helper functions

### [@essex/boolean-expression-component](javascript/boolean-expression-component/README.md)

An expression component to view and toggle filters

## Tests

Limited tests are provided within the packages and most components/functions are experimental

## License

Licensed under the [MIT License](./LICENSE).

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

<!-- docs disable Simply -->

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

<!-- docs enable Simply -->

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
