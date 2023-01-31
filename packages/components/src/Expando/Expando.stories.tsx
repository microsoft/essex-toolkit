/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react';

import { Expando } from './Expando.js';
import type { ExpandoProps } from './Expando.types.js';

const meta = {
  title: '@essex:components/Expando',
  component: Expando,
  args: {
    label: 'More...',
    defaultExpanded: false,
  },
};
export default meta;

export const Primary = {
  render: (args: ExpandoProps) => <Expando {...args}>Here is the child content!</Expando>,
};

export const Customized = {
  render: (args: ExpandoProps) => <Expando {...args}>Here is the child content!</Expando>,

  args: {
    styles: {
      root: {
        border: '1px solid orange',
        background: 'aliceblue',
      },
      content: {
        background: 'coral',
        padding: 8,
      },
    },
    iconButtonProps: {
      iconProps: {
        iconName: 'RedEye',
        styles: {
          root: {
            fontSize: 12,
          },
        },
      },
    },
    linkProps: {
      styles: {
        root: {
          color: 'dodgerblue',
        },
      },
    },
  },
};
