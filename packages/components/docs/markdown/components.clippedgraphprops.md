<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@essex/components](./components.md) &gt; [ClippedGraphProps](./components.clippedgraphprops.md)

## ClippedGraphProps interface

<b>Signature:</b>

```typescript
export interface ClippedGraphProps 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [clipped?](./components.clippedgraphprops.clipped.md) |  | boolean | <i>(Optional)</i> Indicates that the y axis should be clipped due to extreme values. 90th percentile will be plotted. |
|  [data](./components.clippedgraphprops.data.md) |  | number\[\] | List of values to plot. Currently this is the y axis, the x axis is ordinal. TODO: support more complex data types such as x/y points or explicit time series. |
|  [gradient?](./components.clippedgraphprops.gradient.md) |  | boolean | <i>(Optional)</i> Indicates if a gradient fill should be used under the line to add redundant data encoding. |
|  [gradientBand?](./components.clippedgraphprops.gradientband.md) |  | number | <i>(Optional)</i> Indicates if the gradient should just be a band along the top instead of filling under the line. If supplied, this should be a height for the band in pixels. |
|  [gradientInterpolation?](./components.clippedgraphprops.gradientinterpolation.md) |  | number | <i>(Optional)</i> This is a multiplier to use for interpolating gradient values between data values. If your data is not very dense, the gradient fill will look very blocky. Defaults to 4. |
|  [height](./components.clippedgraphprops.height.md) |  | number | Height of the chart in pixels. |
|  [horizon?](./components.clippedgraphprops.horizon.md) |  | boolean | <i>(Optional)</i> Indicates to create a horizon plot instead, by 'wrapping' the top 10% data values around the y axis. |
|  [percentile?](./components.clippedgraphprops.percentile.md) |  | number | <i>(Optional)</i> Percentile of the data to plot on the main graph. The remainder will be plotted as overflow. |
|  [sparkline?](./components.clippedgraphprops.sparkline.md) |  | boolean | <i>(Optional)</i> Render this as a sparkline, i.e., much thinner and lighter. |
|  [width](./components.clippedgraphprops.width.md) |  | number | Width of the chart in pixels. |
