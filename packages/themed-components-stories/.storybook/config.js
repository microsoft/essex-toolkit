import { configure, addDecorator } from '@storybook/react'
import { ThematicFluentDecorator } from './ThematicFluentDecorator'

addDecorator(ThematicFluentDecorator)

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.tsx?$/), module)
