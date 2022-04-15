# @essex/thematic-lineup

### [ThematicLineup](/packages/themed-components-stories/stories/ThematicLineup.stories.tsx)

This component uses the standard [LineUp.js](https://lineup.js.org/) table, and does:

- injection of Thematic
- cleans it up a little bit
- adds a custom filtering mechanism

ThematicLineupStory displays a LineUp instance, while also applying default thematic styles and data colors.
Use it for a React-style JSX wrapper around LineUp that has more potential flexibility than the very configuration limited version exposed by the LineUp project.
This allows arbitrary column configurations via jsx, and a set of global filters if desired.
</br>
<b>Light Theme</b>

<br />

!["Themed-Lineup Light Preview"](../../assets/ThematicLineup-story.JPG)

<b>Dark Theme</b>

<br />

!["Themed-Lineup Dark Preview"](../../assets/ThematicLineup-dark-story.JPG)

### Extending webpack config example

You may need to extend webpack config to get lineup component to work. If you are using the [@essex/scripts](https://www.npmjs.com/package/@essex/scripts) build system, an example of this is:

```jsx
const { configure } = require('@essex/webpack-config')
const base = configure({ pnp: true }) // if using pnp

const lineupRules = [
	{
		test: /\.svg(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: 'url-loader',
		options: {
			limit: 10000, //inline <= 10kb
			mimetype: 'image/svg+xml',
		},
	},
	{
		test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: 'file-loader',
	},
]

base.module.rules = [...base.module.rules, ...lineupRules]

module.exports = base
```

### License

Licensed under the [MIT License](../../LICENSE).
