Fluent 8 uses CSS-in-JS IStyle objects for all styling. This is a collection of hooks to ease the creation of these by merging custom style objects with defaults that can be passed to each component.

A key goal is to introduce a sizing option that allows for consistent scaling of control size. This is a feature emerging in FLuent 9 that we would like to take advantage of as we transition, so we have built a set of IStyle objects for components to emulate this scaled behavior.

Note that Fluent 9 components support a size property that is normally the string 'small' or 'medium'. Some components (e.g., Button) support a 'large' size as well, which we will not support immediately.
