<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@essex/hooks](./hooks.md) &gt; [useDynamicData](./hooks.usedynamicdata.md)

## useDynamicData() function

Hook which allows for the use of a dynamic data source

<b>Signature:</b>

```typescript
export declare function useDynamicData<InputType, OutputType = InputType>(values?: DynamicData<InputType>, map?: (values: InputType) => OutputType, deps?: any[]): OutputType | undefined;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  values | [DynamicData](./hooks.dynamicdata.md)<!-- -->&lt;InputType&gt; | <i>(Optional)</i> The raw set of values, or an iterator to get the values |
|  map | (values: InputType) =&gt; OutputType | <i>(Optional)</i> An optional mapping function which takes a list of values and transforms them |
|  deps | any\[\] | <i>(Optional)</i> The optional list of dependencies to use when updating the values |

<b>Returns:</b>

OutputType \| undefined

The last value from the iterator

