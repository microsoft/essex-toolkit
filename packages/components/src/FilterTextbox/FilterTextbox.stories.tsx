/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react';

import { FilterTextbox } from './FilterTextbox.js';
import type { FilterTextboxProps } from './FilterTextbox.types.js';

const meta = {
  title: '@essex:components/FilterTextbox',
  component: FilterTextbox,
  args: {
    label: 'Label',
    includePlaceholder: 'include placeholder',
    excludePlaceholder: 'exclude placeholder',
  },
};

export default meta;

const Template: StoryFn<typeof FilterTextbox> = (args: FilterTextboxProps) => (
  <FilterTextbox {...args} />
);

const Primary = Template.bind({});
Primary.storyName = 'FilterTextbox';
