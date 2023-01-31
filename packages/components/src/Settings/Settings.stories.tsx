/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, MessageBar } from '@fluentui/react';
import { useCallback, useState } from 'react';

import { Settings } from './Settings.js';

const meta = {
  title: '@essex:components/Settings',
};
export default meta;

// cover the three basic data types
const basicSettings = {
  title: 'Graph',
  algorithm: 'Louvain',
  nodeLimit: 10000,
  showEdges: true,
};

export const BasicSettingsStory = {
  render: () => {
    const [settings, setSettings] = useState(basicSettings);
    const handleChange = useCallback(
      (key, value) => {
        const changed = {
          ...settings,
          [`${key}`]: value,
        };
        setSettings(changed);
      },
      [settings]
    );
    return (
      <>
        <MessageBar>
          This example shows a basic object parsed into settings and rendered into the default
          control set.
          <pre>{`
    {
        title: 'Graph',
        algorithm: 'Louvain',
        nodeLimit: 10000,
        showEdges: true
    }
    `}</pre>
        </MessageBar>
        <Settings settings={settings} onChange={handleChange} />
      </>
    );
  },

  name: 'Basic Settings',
};

export const AdvancedSettingsStory = {
  render: () => {
    const [settings, setSettings] = useState(basicSettings);
    const handleChange = useCallback(
      (key, value) => {
        const changed = {
          ...settings,
          [`${key}`]: value,
        };
        setSettings(changed);
      },
      [settings]
    );
    return (
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
        onChange={handleChange}
      />
    );
  },

  name: 'Advanced Settings',
};

const GroupedPanel = () => {
  const [settings, setSettings] = useState(basicSettings);
  const handleChange = useCallback(
    (key, value) => {
      const changed = {
        ...settings,
        [`${key}`]: value,
      };
      setSettings(changed);
    },
    [settings]
  );
  return (
    <Settings
      settings={settings}
      groups={[
        {
          label: 'Rendering',
          keys: ['nodeLimit', 'showEdges'],
        },
        {
          label: 'Communities',
          keys: ['algorithm'],
        },
      ]}
      onChange={handleChange}
    />
  );
};

export const GroupedSettingsStory = {
  render: () => {
    return (
      <>
        <MessageBar>
          This example shows settings within groups, which automatically get a separator and
          optional label. Any ungrouped settings are placed at the top (&quot;Title&quot; in this
          example).
        </MessageBar>
        <GroupedPanel />
      </>
    );
  },

  name: 'Grouped Settings',
};

export const ContextSettingsStory = {
  render: () => {
    const renderPanel = useCallback(
      () => (
        <div style={{ margin: 10 }}>
          <GroupedPanel />
        </div>
      ),
      []
    );
    return (
      <>
        <MessageBar>This example shows the settings panel in a dropdown context menu.</MessageBar>
        <DefaultButton
          text={'Click for settings'}
          menuProps={{
            items: [
              {
                key: 'dropdown-settings',
                onRender: renderPanel,
              },
            ],
          }}
        />
      </>
    );
  },

  name: 'Context Menu Settings',
};
