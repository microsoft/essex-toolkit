<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@essex/thematic-lineup](./thematic-lineup.md) &gt; [ThematicLineupProps](./thematic-lineup.thematiclineupprops.md)

## ThematicLineupProps interface

<b>Signature:</b>

```typescript
export interface ThematicLineupProps 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [columns](./thematic-lineup.thematiclineupprops.columns.md) |  | [ColumnConfig](./thematic-lineup.columnconfig.md)<!-- -->\[\] | Column configs to instantiate the LineUp instance. |
|  [data](./thematic-lineup.thematiclineupprops.data.md) |  | any\[\] | List of data rows. This can be of any object type, the columns config should map the properties to columns. |
|  [defaultSortAscending?](./thematic-lineup.thematiclineupprops.defaultsortascending.md) |  | boolean | <i>(Optional)</i> Whether to sort the default column ascending or descending. |
|  [defaultSortColumn?](./thematic-lineup.thematiclineupprops.defaultsortcolumn.md) |  | string | <i>(Optional)</i> Default column to sort by. |
|  [filters?](./thematic-lineup.thematiclineupprops.filters.md) |  | [Filter](./thematic-lineup.filter.md)<!-- -->\[\] | <i>(Optional)</i> List of applied filters for the LineUp instance. This is different than LineUp's built-in filtering, allowing us to inject global overrides from external filter interfaces. |
|  [height?](./thematic-lineup.thematiclineupprops.height.md) |  | string \| number | <i>(Optional)</i> |
|  [histograms?](./thematic-lineup.thematiclineupprops.histograms.md) |  | boolean | <i>(Optional)</i> Whether to show the summary header histograms or not. |
|  [patternParams?](./thematic-lineup.thematiclineupprops.patternparams.md) |  | any | <i>(Optional)</i> If link columns exist, they contain a pattern property that needs template replacement. Some values are auto-replaced by LineUp, but for custom params, we need to supply a map. See, e.g., https://lineup.js.org/master/docs/interfaces/\_model\_linkcolumn\_.ilinkdesc.html\#pattern |
|  [width?](./thematic-lineup.thematiclineupprops.width.md) |  | string \| number | <i>(Optional)</i> |
