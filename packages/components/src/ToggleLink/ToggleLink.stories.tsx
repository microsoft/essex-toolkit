/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn } from '@storybook/react';
import { useCallback, useState } from 'react';

import type { ToggleLinkProps } from './ToggleLink.js';
import { ToggleLink } from './ToggleLink.js';

const meta = {
  title: '@essex:components/ToggleLink',
  component: ToggleLink,
  args: {
    messages: ['Show more', 'Show less'],
  },
};

export default meta;

const Template: StoryFn<typeof ToggleLink> = (args: ToggleLinkProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleChange = useCallback((toggled) => setExpanded(toggled), []);
  return (
    <div>
      This is a ToggleLink: <ToggleLink {...args} onChange={handleChange} />
      <div
        style={{
          width: 400,
          height: 100,
          display: expanded ? 'block' : 'none',
        }}
      >
        More information here!
      </div>
    </div>
  );
};

const Primary = Template.bind({});
Primary.storyName = 'ToggleLink';
