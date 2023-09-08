<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@essex/hooks](./hooks.md)

## hooks package

## Functions

|  Function | Description |
|  --- | --- |
|  [useDestroyable(initialValue)](./hooks.usedestroyable.md) | A hook for using a destroyable thing, so when the value changes the previous value is destroyed |
|  [useDimensions(ref)](./hooks.usedimensions.md) | A hook for getting the dimensions of the given element. This hook also updates when the given element resizes. NOTE: ResizeObserver must be defined in the target runtime. BYO polyfill if it is not provided by default |
|  [useDynamicData(values, map, deps)](./hooks.usedynamicdata.md) | Hook which allows for the use of a dynamic data source |
|  [useEventListener(listenerMap, element, deps)](./hooks.useeventlistener.md) | Adds various listeners to the given element and cleans them up when done |
|  [useLongRunning(execute, delay, deps)](./hooks.uselongrunning.md) | A hook which invokes a long running task, and provides a loading flag |
|  [useMicrosoftConsentBanner({ theme, elementId, onChange, })](./hooks.usemicrosoftconsentbanner.md) | Uses the Microsoft cookie consent banner. The banner code should be loaded from CDN using a script tag. <script src="https://wcpstatic.microsoft.com/mscc/lib/v2/wcp-consent.js"></script> You should also include a div for the cookie banner to render into: e.g. <div id="cookie-banner" /> |
|  [useMousePosition(ref, debouceTime)](./hooks.usemouseposition.md) | Gets the current mouse position on the given element |
|  [useScrollListener(listener, element, deps)](./hooks.usescrolllistener.md) | Adds a scroll listener to the given element |
|  [useSelectionHandler(equal, singleSelect)](./hooks.useselectionhandler.md) | Provides basic selection handling, |
|  [useToggle(defaultValue)](./hooks.usetoggle.md) | A hook for a toggleable state |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [Consent](./hooks.consent.md) |  |
|  [ConsentOptions](./hooks.consentoptions.md) |  |
|  [Destroyable](./hooks.destroyable.md) |  |
|  [Dimensions](./hooks.dimensions.md) |  |

## Variables

|  Variable | Description |
|  --- | --- |
|  [useInterval](./hooks.useinterval.md) | Creates an interval with the specified delay, and clears it on unmount. |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [DynamicData](./hooks.dynamicdata.md) |  |
