/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react';

import type { SparkbarProps } from '../Sparkbar.js';
import { Sparkbar } from '../Sparkbar.js';

const meta = {
  title: '@essex:charts-react/Sparkbar',
  component: Sparkbar,
  args: {
    width: 150,
    height: 30,
    data: [1, 2, 1.5, 4, 5, 4, 7],
  },
};
export default meta;

export const Primary = {
  name: 'Sparkbar',
};
