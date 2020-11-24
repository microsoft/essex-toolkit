# @essex-js-toolkit/hierarchy-browser

A React component to view hierarchical data relating to graph communities.

## Example implementations:

Asynchronous Loading:

```jsx
const communities = [{communityId: "123", size: 20, neighborSize: 30 },{communityId: "457", size: 10, neighborSize: 5 }]

const loadEntitiesAsync = useCallback(async (params)=>{
    const data = await handleDataRemotely(params)
    return ({data, error: undefined})
},[handleDataRemotely])

const loadNeighborCommunitiesAsync = useCallback(async (params)=>{
   const data = await handleDataRemotely(params)
    return ({data, error: undefined})
},[handleDataRemotely])

<HierarchyBrowser
    communities={communities}
    entities={loadEntitiesAsync}
	neighbors={loadNeighborCommunitiesAsync}
	settings={{visibleColumns: ["score"], isOpen: false}}
/>
```

Synchronous Loading:

```jsx
const communities = [{communityId: "123", size: 20, entityIds: ["1", "2"], neighborSize: 1 },{communityId: "457", size: 10, entityIds: ["1", "4", "9"], neighborSize: 2 }]

const entities = [{id: "1", attrs:{score: 12.1}},
{id: "2", attrs:{score: 2.3}},
{id: "3", attrs:{score: 3.6}},
{id: "4", attrs:{score: 9.8}},
{id: "6", attrs:{score: 22.4}},
{id: "9", attrs:{score: 3.8}}
] // entities from communities and neighbor communities

const neighbors = [
    {communityId: "378", size: 1, entityIds: ["6"], connections: 2, edgeCommunityId: "123" },
    {communityId: "026", size: 1, entityIds: ["3", "6"], connections: 4, edgeCommunityId: "457" }
]

<HierarchyBrowser
    communities={communities}
    entities={entities}
	neighbors={neighbors}
	settings={{visibleColumns: ["score"], isOpen: false}}
/>
```

## Interfaces

#### Communities

```jsx
ICommunityDetail[] // only required prop for HierarchyBrowser
```

```jsx
type EntityId = string
type CommunityId = string
interface ICommunityDetail {
	communityId: CommunityId
	entityIds?: EntityId[] // only needed if synchronous
	size: number // total number of entities
	neighborSize?: number // total number of neigbor communities
}
```

#### Neighbors

```jsx
INeighborCommunityDetail[] // optional neighbor (synchronous) prop for HierarchyBrowser
```

```jsx
 interface INeighborCommunityDetail extends ICommunityDetail {
	connections: number
	edgeCommunityId: CommunityId // link to Community Object
}
```

```jsx
ILoadNeighborCommunitiesAsync // optional neighbors (asynchronous) prop for HierarchyBrowser
```

```jsx
// callback with more neighbors (INeighborCommunityDetail[])
interface IHierarchyNeighborResponse {
	data: INeighborCommunityDetail[]
	error: Error | null | undefined
}
 interface ILoadNeighborCommunitiesAsync {
	(params: ILoadParams): Promise<IHierarchyNeighborResponse>
}
```

#### Entities

```jsx
IEntityDetail[] // optional entities (synchronous) prop for HierarchyBrowser
```

```jsx
interface IEntityDetail {
	id: EntityId
	attrs?: { [key: string]: string | number }
}
// anything in attrs prop is displayed on table
```

```jsx
ILoadEntitiesAsync // optional entities (asynchronous) prop for HierarchyBrowser
```

```jsx
// callback with more entities (IEntityDetail[])
interface IHierarchyDataResponse {
	data: IEntityDetail[]
	error: Error | null | undefined
}
 interface ILoadEntitiesAsync {
    (params: ILoadParams): Promise<IHierarchyDataResponse>
}
```

#### Asynchronous Parameters

```jsx
interface ILoadParams {
	communityId: CommunityId
	level: number
	count: number
	offset: number
	filtered: boolean
}
// if filter flag is on, expects return value to be from filtered array

```

#### Settings

Optional property that allows customization of table view.

```jsx
interface ISettings {
	visibleColumns?: string[]
	styles?: IStyles
	isOpen?: boolean
	minimizeColumns?: boolean
	controls?: IControls
}
```

<b>visibleColumns:</b> keys to display in tables
<b>styles:</b> fluent font sizes for card components
<b>isOpen:</b> default state for table visibility
<b>minimizeColumns:</b> show only `id` key in table
<b>controls:</b> display controls of card header

```jsx
interface ICardOverviewSettings {
	header?: ITextProps['variant']
	subheader?: ITextProps['variant']
}

interface ITableSettings {
	header?: ITextProps['variant']
	subheader?: ITextProps['variant']
	tableItems?: ITextProps['variant']
}
interface IStyles {
	cardOverview: ICardOverviewSettings
	table: ITableSettings
}

interface IControls {
	showLevel?: boolean
	showMembership?: boolean
	showFilter?: boolean
	showExport?: boolean
}
```

### License

Licensed under the [MIT License](../../LICENSE).
