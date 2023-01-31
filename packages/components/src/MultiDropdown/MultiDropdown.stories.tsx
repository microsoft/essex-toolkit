/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react';
import { useCallback, useState } from 'react';

import { MultiDropdown } from './MultiDropdown.js';
import type { MultiDropdownProps } from './MultiDropdown.types.js';

const meta = {
  title: '@essex:components/MultiDropdown',
  component: MultiDropdown,
  args: {
    options: [
      {
        key: 'one',
        text: 'One',
      },
      {
        key: 'two',
        text: 'Two',
      },
      {
        key: 'three',
        text: 'Three',
      },
      {
        key: 'four',
        text: 'Four',
      },
    ],
  },
};
export default meta;

const PrimaryComponent: React.FC<MultiDropdownProps> = (args) => {
    const [selectedKeys, setSelectedKeys] = useState<string[] | number[]>(['one']);
    const onChange = useCallback(
      (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setSelectedKeys((prev: any[]) => {
          return option?.selected
            ? [...prev, option?.key]
            : prev.filter((d: string | number) => d !== option?.key);
        });
      },
      [setSelectedKeys]
    );
    const onChangeAll = useCallback(
      (
        _event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>,
        options?: IDropdownOption[]
      ) => setSelectedKeys(options?.map((opt) => opt.key as string) || []),
      [setSelectedKeys]
    );
    return (
      <MultiDropdown
        {...args}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onChangeAll={onChangeAll}
      />
    );

}

export const Primary = {
  render: (args: MultiDropdownProps) => <PrimaryComponent {...args} />,
  name: 'MultiDropdown',
};
