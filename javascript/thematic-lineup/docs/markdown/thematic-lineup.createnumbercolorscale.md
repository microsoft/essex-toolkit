<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@essex/thematic-lineup](./thematic-lineup.md) &gt; [createNumberColorScale](./thematic-lineup.createnumbercolorscale.md)

## createNumberColorScale variable

Creates a nominal scale for numeric column assignment. This looks through the configs to count up the numeric columns, so that each one can be assigned a unique color from the scale. TODO: the scale function could be much more flexbile like d3 scales (domain/range), this just assumes an auto-incrementing index based on column order

<b>Signature:</b>

```typescript
createNumberColorScale: (scaleCreator: (count: number) => (index: number) => Color, configs: ColumnConfig[]) => (() => string)
```