# Fluent v9 Migration Plan

We use Fluent UI extensively in our UI stack, and have traditionally made an effort to stay up-to-date with current versions. Fluent v9 is a major, breaking version that will require an transitionary effort to migrate to. 

New applications should strive to use Fluent v9 as much as possible, while existing components and applications will require an upgrade path.

Not all Fluent v8 components have a v9 equivalent. For cases like these we will continue using the Fluent v8 component until an equivalent component is available.

[Fluent v9 Migration Recommendations](https://react.fluentui.dev/?path=/docs/concepts-migration-getting-started--page)
[Fluent v8/v9 Component Mapping](https://react.fluentui.dev/?path=/docs/concepts-migration-from-v8-component-mapping--page)

Here, we will track which components we use from Fluent v8, whether a target component is available for migration, and its migration status.

(Last Updated 1/31/2023)

v8 Component | v9 Component | Migration Status
--- | --- | ---
ActionButton | Button | TBD
CheckBox | CheckBox | TBD
ChoiceGroup | - | -
ColorPicker | - | -
CommandBar | - | -
DefaultButton | Button | TBD
Dialog | - | -
Dropdown | ~Dropdown | TBD
Icon | @fluentui/react-icons | TBD
IconButton | Button | TBD
Label | Label | TBD
Link | Link | TBD
MessageBar | - | -
Nav | - | -
Pivot | TabList | TBD
PrimaryButton | Button | TBD
Separator | Divider | TBD
Slider | Slider | TBD
SpinButton | ~SpinButton | TBD
Spinner | Spinner | TBD
Text | Text | TBD
TextField | Input | TBD
Toggle | Switch | TBD
Tooltip| Tooltip | TBD