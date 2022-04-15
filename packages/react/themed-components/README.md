# @essex/themed-components

Provides a set of Experimental React components with built-in Thematic support
works in harmony with Thematic library styling and contains ready-to-use data visuals.
These are experimental with potential for expansion.

See [themed-components-stories](/packages/themed-components-stories/README.md) Package to play with the themed-components in StoryBook.

## Components

### [ClippedGraph](/packages/themed-components-stories/stories/ClippedGraph.stories.tsx)

ClippedGraph is a component that creates a line chart that handles extreme distributions with a few clipping/wrapping strategies.
The "clipped graph" concept was presented by Haihan Lin, Carolina Nobre, Amanda Bakian, Alexander Lex at IEEE Information Visualization Conference (InfoVis 2019). https://vdl.sci.utah.edu/publications/2019_infovis_clipped_graphs/
This chart can also produce a horizon plot, or be formatted to look like a sparkline.

```jsx
<ClippedGraph
	width={800}
	height={100}
	data={[1, 5, 2, 3, 1]}
	clipped={true}
	gradient={true}
/>
```

### [ControlledHistogramFilter](/packages/themed-components-stories/stories/ControlledHistogramFilter.stories.tsx)

ControlledHistogramFilter is a styled D3.js SVG histogram that performs brushing and filtering

```jsx
import { ControlledHistogramFilter } from '@essex/themed-components'
```

```jsx
interface ControlledHistogramFilterProps {
	name: string;
	data: number[];
	width: number;
	height: number;
	selectedRange: [number | undefined, number | undefined];
	onChange?: (range: [number | undefined, number | undefined]) => any;
	selectedFill?: string;
	unselectedFill?: string;
}
```

<b>Example:</b>

```jsx
<ControlledHistogramFilter
	name={'histogram name'}
	data={[1, 5, 2, 3, 1]}
	width={600}
	height={400}
	selectedRange={[undefined, undefined]}
/>
```

### [Settings](/packages/themed-components-stories/stories/Settings.stories.tsx)

Automatic configuration settings panel that parses a supplied configuration object and generates a list of Fluent UI controls based on the data types.
A configuration object can be supplied that maps specific object fields to more detailed control configuration, such as changing between a Toggle or Checkbox.
In addition, an onChange handler will invoke for any setting, supplying the changed setting's key and new value.
Note that this could be used in an entirely declarative, serializable manner if desired.

<b>Example:</b>

```jsx
const settings = {
  title: 'Graph',
  algorithm: 'Louvain',
  nodeLimit: 10000,
  showEdges: true
}
<Settings
  settings={settings}
  config={
    {
    title: {
      control: 'dropdown',
      params: { options: ['None', 'Graph', 'Nodes', 'Edges'] },
    },
    algorithm: {
      control: 'radio',
      params: { options: ['Louvain', 'Leiden'] },
    },
    nodeLimit: {
      control: 'slider',
      params: {
        max: 20000,
        step: 1000,
      },
    },
    showEdges: {
      control: 'checkbox',
    },
    } as any
  }
  onChange={()=>{}}
/>

```

### License

Licensed under the [MIT License](../../LICENSE).
