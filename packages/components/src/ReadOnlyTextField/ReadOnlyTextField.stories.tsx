/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITextFieldProps } from '@fluentui/react';
import type { StoryFn } from '@storybook/react';

import { ReadOnlyTextField } from './ReadOnlyTextField.js';

const meta = {
  title: '@essex:components/ReadOnlyTextField',
  component: ReadOnlyTextField,
  args: {
    value: 'Read only text',
  },
};
export default meta;

export const Primary = {
  name: 'ReadOnlyTextField',
};
