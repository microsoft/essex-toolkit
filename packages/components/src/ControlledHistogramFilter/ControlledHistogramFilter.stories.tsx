/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react';
import { useState } from 'react';

import type { ControlledHistogramFilterProps } from './ControlledHistogramFilter.js';
import { ControlledHistogramFilter } from './ControlledHistogramFilter.js';

const meta = {
  title: '@essex:components/ControlledHistogramFilter',
  component: ControlledHistogramFilter,
  args: {
    name: 'name',
    width: 600,
    height: 400,
    data: [
      1, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 5, 4, 5, 6, 5, 6, 5, 4, 3, 4, 3, 2, 3, 2, 3, 4, 3, 6, 7,
      8, 7, 8, 7, 8, 7, 8, 9, 8, 9, 8, 7, 6, 7, 6, 5, 6,
    ],
  },
};
export default meta;

export const Primary = {
  render: (args: ControlledHistogramFilterProps) => {
    const [selectedRange, setSelectedRange] = useState<[number | undefined, number | undefined]>([
      undefined,
      undefined,
    ]);
    const handleRangeChanged = (range: [number | undefined, number | undefined]) => {
      setSelectedRange(range);
    };
    return (
      <ControlledHistogramFilter
        {...args}
        selectedRange={selectedRange}
        onChange={handleRangeChanged}
      />
    );
  },

  name: 'ControlledHistogramFilter',
};
