/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StoryFn } from '@storybook/react';

import { defaultBannerLinks, PolicyAndCookieBanner } from './PolicyAndCookieBanner.js';
import type { PolicyAndCookieBannerProps } from './PolicyAndCookieBanner.types.js';

const meta = {
  title: '@essex:components/PolicyAndCookieBanner',
  args: {
    onError: window.alert.bind(window),
  },
};

export default meta;

export const Simple = {
  render: (args: PolicyAndCookieBannerProps) => <PolicyAndCookieBanner {...args} />,

  name: 'Simple use case',
};

export const Theme = {
  render: (args: PolicyAndCookieBannerProps) => <PolicyAndCookieBanner {...args} />,

  args: {
    theme: 'dark',
  },

  name: 'Theming cookie banner',
};

export const CookieChanges = {
  render: (args: PolicyAndCookieBannerProps) => <PolicyAndCookieBanner {...args} />,

  args: {
    onConsentChange: (consents) => console.log(consents),
  },

  name: 'Listen for cookie consent changes',
};

export const Styling = {
  render: (args: PolicyAndCookieBannerProps) => <PolicyAndCookieBanner {...args} />,

  args: {
    className: 'some-class-perhaps-provided-by-StyledComponets',
    styles: { flexDirection: 'column' },
  },

  name: 'Styling',
};

export const CustomLinks = {
  render: (args: PolicyAndCookieBannerProps) => <PolicyAndCookieBanner {...args} />,

  args: {
    links: [{ name: 'Bing', href: 'https://bing.com' }],
  },

  name: 'Custom links (overrride)',
};

export const AdditionalLinks = {
  render: (args: PolicyAndCookieBannerProps) => <PolicyAndCookieBanner {...args} />,

  args: {
    links: [...defaultBannerLinks, { name: 'Bing', href: 'https://bing.com' }],
  },

  name: 'Additional links',
};
