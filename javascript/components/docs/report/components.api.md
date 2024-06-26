## API Report File for "@essex/components"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { CSSProperties } from 'react';
import type { FC } from 'react';
import type { IButtonProps } from '@fluentui/react';
import type { IButtonStyles } from '@fluentui/react';
import type { ICheckboxProps } from '@fluentui/react';
import type { IChoiceGroupProps } from '@fluentui/react';
import type { IColorPickerProps } from '@fluentui/react';
import type { ICommandBarStyleProps } from '@fluentui/react';
import type { ICommandBarStyles } from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react';
import type { IContextualMenuItemStyles } from '@fluentui/react';
import type { IContextualMenuListProps } from '@fluentui/react';
import type { IContextualMenuProps } from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import type { IDropdownProps } from '@fluentui/react';
import type { IIconProps } from '@fluentui/react';
import type { IIconStyles } from '@fluentui/react';
import type { ILabelProps } from '@fluentui/react';
import type { ILinkProps } from '@fluentui/react';
import type { INavProps } from '@fluentui/react';
import type { IPivotProps } from '@fluentui/react';
import type { IRenderFunction } from '@fluentui/react';
import type { ISliderProps } from '@fluentui/react';
import type { ISpinButtonProps } from '@fluentui/react';
import type { IStyleFunctionOrObject } from '@fluentui/react';
import type { ITextFieldProps } from '@fluentui/react';
import type { IToggleProps } from '@fluentui/react';
import type { Position } from '@fluentui/react';
import type { PropsWithChildren } from 'react';
import type { default as React_2 } from 'react';

// Warning: (ae-missing-release-tag) "ButtonChoiceGroup" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ButtonChoiceGroup: React.FC<IChoiceGroupProps>;

// Warning: (ae-missing-release-tag) "Chip" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const Chip: React.FC<ChipItemProps>;

// Warning: (ae-missing-release-tag) "ChipItem" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ChipItem {
    // (undocumented)
    canClose?: boolean;
    // (undocumented)
    iconName?: string;
    // (undocumented)
    key: string;
    // (undocumented)
    text?: string;
}

// Warning: (ae-missing-release-tag) "ChipItemProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ChipItemProps {
    // (undocumented)
    item: ChipItem;
    // (undocumented)
    onClick?: () => void;
    // (undocumented)
    onClose?: () => void;
    // (undocumented)
    styles?: ChipsStyles;
}

// Warning: (ae-missing-release-tag) "Chips" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const Chips: React.FC<ChipsProps>;

// Warning: (ae-missing-release-tag) "ChipsProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ChipsProps {
    // (undocumented)
    items: ChipItem[];
    // (undocumented)
    onClick?: (key: string) => void;
    // (undocumented)
    onClose?: (key: string) => void;
    // (undocumented)
    styles?: ChipsStyles;
}

// Warning: (ae-missing-release-tag) "ChipsStyles" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ChipsStyles {
    // (undocumented)
    item?: ChipStyles;
    // (undocumented)
    root?: React.CSSProperties;
}

// Warning: (ae-missing-release-tag) "ChipStyles" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ChipStyles {
    // (undocumented)
    close?: IButtonStyles;
    // (undocumented)
    icon?: IIconStyles;
    // (undocumented)
    root?: React.CSSProperties;
}

// Warning: (ae-missing-release-tag) "ClippedGraph" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ClippedGraph: ({ data, width, height, clipped, percentile, gradient, gradientInterpolation, gradientBand, horizon, sparkline, }: ClippedGraphProps) => JSX.Element;

// Warning: (ae-missing-release-tag) "ClippedGraphProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ClippedGraphProps {
    clipped?: boolean;
    data: number[];
    gradient?: boolean;
    gradientBand?: number;
    gradientInterpolation?: number;
    height: number;
    horizon?: boolean;
    percentile?: number;
    sparkline?: boolean;
    width: number;
}

// Warning: (ae-missing-release-tag) "CollapsiblePanel" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const CollapsiblePanel: React.FC<PropsWithChildren<CollapsiblePanelProps>>;

// Warning: (ae-missing-release-tag) "CollapsiblePanelContainer" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const CollapsiblePanelContainer: React.FC<PropsWithChildren<CollapsiblePanelContainerProps>>;

// Warning: (ae-missing-release-tag) "CollapsiblePanelContainerProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface CollapsiblePanelContainerProps {
    // (undocumented)
    styles?: {
        root?: CSSProperties;
    };
}

// Warning: (ae-missing-release-tag) "CollapsiblePanelProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface CollapsiblePanelProps {
    buttonProps?: IButtonProps;
    defaultExpanded?: boolean;
    duration?: number;
    expanded?: boolean;
    first?: boolean;
    hideIcon?: boolean;
    last?: boolean;
    onHeaderClick?: () => void;
    onIconClick?: () => void;
    onRenderHeader?: IRenderFunction<any>;
    styles?: CollapsiblePanelStyles;
    title?: string;
}

// Warning: (ae-missing-release-tag) "CollapsiblePanelStyles" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface CollapsiblePanelStyles {
    content?: CSSProperties;
    header?: CSSProperties;
    root?: CSSProperties;
    title?: CSSProperties;
    titleContainer?: CSSProperties;
}

// Warning: (ae-missing-release-tag) "ColumnarMenu" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ColumnarMenu: React.FC<ColumnarMenuProps>;

// Warning: (ae-forgotten-export) The symbol "ColumnarMenuListProps" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "ColumnarMenuList" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ColumnarMenuList: React.FC<ColumnarMenuListProps>;

// Warning: (ae-missing-release-tag) "ColumnarMenuProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ColumnarMenuProps extends IContextualMenuProps {
    buttonProps?: IButtonProps;
    // (undocumented)
    menuListProps?: Partial<ColumnarMenuListProps>;
    text?: string;
}

// Warning: (ae-missing-release-tag) "ControlledHistogramFilter" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ControlledHistogramFilter: ({ name, data, width, height, selectedRange, onChange, selectedFill, unselectedFill, }: ControlledHistogramFilterProps) => JSX.Element;

// Warning: (ae-missing-release-tag) "ControlledHistogramFilterProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ControlledHistogramFilterProps {
    // (undocumented)
    data: number[];
    // (undocumented)
    height: number;
    // (undocumented)
    name: string;
    // (undocumented)
    onChange?: (range: [number | undefined, number | undefined]) => any;
    // (undocumented)
    selectedFill?: string;
    // (undocumented)
    selectedRange: [number | undefined, number | undefined];
    // (undocumented)
    unselectedFill?: string;
    // (undocumented)
    width: number;
}

// Warning: (ae-missing-release-tag) "ControlParams" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface ControlParams {
    max?: number;
    min?: number;
    options?: string[];
    step?: number;
}

// Warning: (ae-missing-release-tag) "ControlType" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export enum ControlType {
    // (undocumented)
    Checkbox = "checkbox",
    // (undocumented)
    Dropdown = "dropdown",
    // (undocumented)
    Radio = "radio",
    // (undocumented)
    Slider = "slider",
    // (undocumented)
    Spinner = "spinner",
    // (undocumented)
    Textbox = "textbox",
    // (undocumented)
    Toggle = "toggle"
}

// @public
export type CookieConsent = Record<CookieConsentCategories, boolean>;

// @public
export type CookieConsentBannerThemes = 'light' | 'dark' | 'high-contrast';

// @public (undocumented)
export enum CookieConsentCategories {
    Advertising = "Advertising",
    Analytics = "Analytics",
    Required = "Required",
    SocialMedia = "SocialMedia"
}

// Warning: (ae-internal-missing-underscore) The name "CookieConsentManager" should be prefixed with an underscore because the declaration is marked as @internal
//
// @internal (undocumented)
export type CookieConsentManager = {
    readonly isConsentRequired: boolean;
    getConsent(): CookieConsent;
    getConsentFor(consentCategory: CookieConsentCategories): boolean;
    manageConsent(): void;
};

// Warning: (ae-missing-release-tag) "DataType" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum DataType {
    // (undocumented)
    Array = "array",
    // (undocumented)
    Boolean = "boolean",
    // (undocumented)
    Number = "number",
    // (undocumented)
    String = "string"
}

// Warning: (ae-missing-release-tag) "defaultBannerLinks" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const defaultBannerLinks: Array<PolicyLinkDetails>;

// Warning: (ae-missing-release-tag) "DialogConfirm" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const DialogConfirm: React.FC<{
    toggle: () => void;
    onConfirm: () => void;
    show?: boolean;
    title: string;
    subText?: string;
}>;

// Warning: (ae-missing-release-tag) "EnumButtonBar" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function EnumButtonBar<E>({ enumeration, selected, onChange, styles, iconNames, iconOnly, }: EnumButtonBarProps<E>): JSX.Element;

// Warning: (ae-missing-release-tag) "EnumButtonBarProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface EnumButtonBarProps<E> {
    // (undocumented)
    enumeration: any;
    iconNames?: string[];
    // (undocumented)
    iconOnly?: boolean;
    // (undocumented)
    onChange?: (selected: string | number) => void;
    // (undocumented)
    selected?: E;
    // (undocumented)
    styles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>;
}

// Warning: (ae-missing-release-tag) "EnumDropdown" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const EnumDropdown: React.FC<EnumDropdownProps>;

// Warning: (ae-missing-release-tag) "EnumDropdownProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface EnumDropdownProps<E = unknown> extends Omit<IDropdownProps, 'options'> {
    // (undocumented)
    enumeration: E;
    labels?: Record<string, string>;
}

// Warning: (ae-missing-release-tag) "Expando" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const Expando: FC<PropsWithChildren<ExpandoProps>>;

// Warning: (ae-missing-release-tag) "ExpandoProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ExpandoProps {
    defaultExpanded?: boolean;
    iconButtonProps?: IButtonProps;
    label: string;
    linkProps?: ILinkProps;
    styles?: ExpandoStyles;
}

// Warning: (ae-missing-release-tag) "ExpandoStyles" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ExpandoStyles {
    content?: CSSProperties;
    expando?: CSSProperties;
    root?: CSSProperties;
}

// Warning: (ae-missing-release-tag) "FilterTextbox" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const FilterTextbox: ({ label, includePlaceholder, excludePlaceholder, onFilter, }: FilterTextboxProps) => JSX.Element;

// Warning: (ae-missing-release-tag) "FilterTextboxProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface FilterTextboxProps {
    excludePlaceholder?: string;
    includePlaceholder?: string;
    label?: string;
    onFilter?: (text: string, exclude: boolean) => any;
}

// Warning: (ae-missing-release-tag) "getEnumDropdownOptions" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function getEnumDropdownOptions<E = Record<string, string>>(enumeration: E, labels?: Record<string, string>): IDropdownOption[];

// Warning: (ae-missing-release-tag) "GroupedTerm" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GroupedTerm {
    // (undocumented)
    count: number;
    // (undocumented)
    date: Date;
    // (undocumented)
    term: string;
}

// Warning: (ae-missing-release-tag) "MarkdownBrowser" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const MarkdownBrowser: React.FC<MarkdownBrowserProps>;

// Warning: (ae-missing-release-tag) "MarkdownBrowserProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface MarkdownBrowserProps {
    // (undocumented)
    backButtonProps?: IButtonProps;
    content: Record<string, string>;
    home?: string;
    // (undocumented)
    homeButtonProps?: IButtonProps;
    // (undocumented)
    styles?: MarkdownBrowserStyles;
}

// Warning: (ae-missing-release-tag) "MarkdownBrowserStyles" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface MarkdownBrowserStyles {
    markdown?: CSSProperties;
    navigation?: CSSProperties;
    root?: CSSProperties;
}

// Warning: (ae-missing-release-tag) "MultiDropdown" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const MultiDropdown: React.FC<MultiDropdownProps>;

// Warning: (ae-missing-release-tag) "MultiDropdownProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface MultiDropdownProps extends IDropdownProps {
    // (undocumented)
    onChangeAll?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>, options?: IDropdownOption[], indexes?: number[]) => void;
}

// Warning: (ae-missing-release-tag) "NumberSpinButton" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const NumberSpinButton: ({ label, value, min, max, step, onChange, labelPosition, incrementButtonAriaLabel, decrementButtonAriaLabel, }: NumberSpinButtonProps) => JSX.Element;

// Warning: (ae-missing-release-tag) "NumberSpinButtonProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface NumberSpinButtonProps {
    // (undocumented)
    decrementButtonAriaLabel?: string;
    // (undocumented)
    incrementButtonAriaLabel?: string;
    // (undocumented)
    label: string;
    // (undocumented)
    labelPosition?: Position;
    // (undocumented)
    max?: number;
    // (undocumented)
    min?: number;
    // (undocumented)
    onChange?: (n: number) => any;
    // (undocumented)
    step?: number;
    // (undocumented)
    value: number;
}

// Warning: (ae-missing-release-tag) "PolicyAndCookieBanner" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const PolicyAndCookieBanner: FC<PolicyAndCookieBannerProps>;

// @public
export type PolicyAndCookieBannerProps = {
    language?: string;
    theme?: CookieConsentBannerThemes;
    onConsentChange?: (newConsent: CookieConsent) => void;
    onError: (error: unknown) => void;
    className?: string;
    styles?: CSSProperties;
    links?: Array<PolicyLinkDetails>;
};

// @public (undocumented)
export type PolicyLinkDetails = {
    name: string;
    href?: string;
    onClick?: () => void;
    hide?: boolean;
};

// Warning: (ae-internal-missing-underscore) The name "PolicyLinkProps" should be prefixed with an underscore because the declaration is marked as @internal
//
// @internal (undocumented)
export type PolicyLinkProps = {
    name: string;
    id?: string;
    href?: string;
    onClick?: () => void;
    divider?: boolean;
};

// Warning: (ae-missing-release-tag) "ReadOnlyTextField" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ReadOnlyTextField: React.FC<ITextFieldProps>;

// Warning: (ae-missing-release-tag) "SearchBox" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const SearchBox: ({ defaultValue, label, placeholder, errorMessage, onSearch, }: SearchBoxProps) => JSX.Element;

// Warning: (ae-missing-release-tag) "SearchBoxProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface SearchBoxProps {
    defaultValue?: string;
    errorMessage?: string;
    label?: string;
    onSearch?: (query: string) => any;
    placeholder?: string;
}

// Warning: (ae-missing-release-tag) "SettingConfig" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface SettingConfig {
    control?: ControlType;
    defaultValue?: any;
    label?: string;
    params?: ControlParams;
    type?: DataType;
}

// Warning: (ae-missing-release-tag) "Settings" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const Settings: ({ settings, config, groups, onChange, }: SettingsProps) => JSX.Element;

// Warning: (ae-missing-release-tag) "SettingsConfig" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export type SettingsConfig = Record<string, SettingConfig>;

// Warning: (ae-missing-release-tag) "SettingsGroup" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface SettingsGroup {
    // (undocumented)
    keys: string[];
    // (undocumented)
    label?: string;
}

// Warning: (ae-missing-release-tag) "SettingsProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface SettingsProps {
    config?: SettingsConfig;
    groups?: SettingsGroup[];
    onChange?: (key: string, value: any) => void;
    settings?: any;
}

// Warning: (ae-missing-release-tag) "Size" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type Size = 'small' | 'medium';

// Warning: (ae-missing-release-tag) "Sized" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface Sized {
    // (undocumented)
    size?: Size;
}

// Warning: (ae-missing-release-tag) "SparkbarProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface SparkbarProps {
    barGap?: number;
    barWidth?: number;
    data: unknown[];
    height: number;
    id: (d: unknown) => string;
    marked?: (d: unknown) => boolean;
    nodata?: (d: unknown) => boolean;
    onClick?: (d: unknown) => void;
    selected?: (d: unknown) => boolean;
    value: (d: unknown) => number;
    width: number;
    xScale?: (d: unknown, i: number) => number;
}

// Warning: (ae-missing-release-tag) "TermBarProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TermBarProps {
    // (undocumented)
    barWidth?: number;
    // (undocumented)
    dateExtent?: [Date, Date];
    // (undocumented)
    height: number;
    // (undocumented)
    markedDate?: Date;
    // (undocumented)
    selectionExtent?: [Date, Date];
    // (undocumented)
    terms: GroupedTerm[];
    // (undocumented)
    width: number;
}

// Warning: (ae-missing-release-tag) "TimeBrush" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const TimeBrush: React.FC<TimeBrushProps>;

// Warning: (ae-missing-release-tag) "TimeBrushFooterProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TimeBrushFooterProps {
    barWidth?: number;
    brushRange?: [Date, Date];
    dateRange: [Date, Date];
    height: number;
    // (undocumented)
    onBrushEnd?: (range: [Date, Date] | null) => void;
    roundToDay?: boolean;
    width: number;
}

// Warning: (ae-missing-release-tag) "TimeBrushProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TimeBrushProps {
    // (undocumented)
    dateRange: [Date, Date];
    // (undocumented)
    elements: GroupedTerm[];
    // (undocumented)
    footerWidth?: number;
    // (undocumented)
    from?: string;
    // (undocumented)
    height?: number;
    // (undocumented)
    markedDate?: Date;
    // (undocumented)
    onChange: (from: string, to: string) => void;
    // (undocumented)
    selectionRange?: [Date, Date];
    // (undocumented)
    to?: string;
    // (undocumented)
    width?: number;
}

// Warning: (ae-missing-release-tag) "ToggleLink" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const ToggleLink: React.FC<ToggleLinkProps>;

// Warning: (ae-missing-release-tag) "ToggleLinkProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ToggleLinkProps {
    // (undocumented)
    className?: string;
    // (undocumented)
    messages: [string, string];
    // (undocumented)
    onChange?: (toggled: boolean) => void;
    // (undocumented)
    style?: React.CSSProperties;
}

// Warning: (ae-missing-release-tag) "ToolPanel" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const ToolPanel: React.FC<React.PropsWithChildren<ToolPanelProps>>;

// Warning: (ae-missing-release-tag) "ToolPanelProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ToolPanelProps {
    // (undocumented)
    closeIconProps?: IIconProps;
    // (undocumented)
    hasCloseButton?: boolean;
    // (undocumented)
    headerIconProps?: IIconProps;
    // (undocumented)
    headerText?: string;
    // (undocumented)
    onDismiss?: () => void;
    // (undocumented)
    styles?: ToolPanelStyles;
}

// Warning: (ae-missing-release-tag) "ToolPanelStyles" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ToolPanelStyles {
    // (undocumented)
    content?: React_2.CSSProperties;
    // (undocumented)
    header?: React_2.CSSProperties;
    // (undocumented)
    root?: React_2.CSSProperties;
    // (undocumented)
    title?: React_2.CSSProperties;
    // (undocumented)
    titleContainer?: React_2.CSSProperties;
}

// Warning: (ae-missing-release-tag) "Tree" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const Tree: React.FC<TreeProps>;

// Warning: (ae-missing-release-tag) "TreeGroup" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface TreeGroup {
    // (undocumented)
    key: string;
    // (undocumented)
    text?: string;
}

// Warning: (ae-missing-release-tag) "TreeGroupProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TreeGroupProps {
    // (undocumented)
    group: TreeGroup;
    // (undocumented)
    onRenderGroupHeader?: IRenderFunction<TreeGroupProps>;
    // (undocumented)
    size?: Size;
    // Warning: (ae-forgotten-export) The symbol "TreeStyles" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    styles?: TreeStyles;
}

// Warning: (ae-missing-release-tag) "TreeItem" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TreeItem {
    children?: TreeItem[];
    depth?: number;
    expanded?: boolean;
    group?: string;
    iconName?: string;
    // (undocumented)
    key: string;
    menuItems?: IContextualMenuItem[];
    onClick?: (item: TreeItem) => void;
    onExpand?: (item: TreeItem) => void;
    onRenderContent?: IRenderFunction<TreeItemProps>;
    onRenderTitle?: IRenderFunction<TreeItemProps>;
    selected?: boolean;
    // (undocumented)
    text?: string;
}

// Warning: (ae-missing-release-tag) "TreeItemProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TreeItemProps extends TreePropsBase {
    // (undocumented)
    item: TreeItem;
}

// Warning: (ae-missing-release-tag) "TreeProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TreeProps extends TreePropsBase {
    groups?: TreeGroup[];
    items: TreeItem[];
    onItemClick?: (item: TreeItem) => void;
    onItemExpandClick?: (item: TreeItem) => void;
    onRenderGroupHeader?: IRenderFunction<TreeGroupProps>;
    selectedKey?: string;
}

// Warning: (ae-missing-release-tag) "TreePropsBase" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface TreePropsBase {
    contentButtonProps?: IButtonProps;
    // Warning: (ae-forgotten-export) The symbol "ExpandIconButtonProps" needs to be exported by the entry point index.d.ts
    expandButtonProps?: ExpandIconButtonProps;
    // Warning: (ae-forgotten-export) The symbol "MenuButtonProps" needs to be exported by the entry point index.d.ts
    menuButtonProps?: MenuButtonProps;
    narrow?: boolean;
    size?: Size;
    styles?: TreeStyles;
}

// Warning: (ae-missing-release-tag) "useButtonProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useButtonProps(props: Partial<IButtonProps>, size?: Size): Partial<IButtonProps>;

// Warning: (ae-missing-release-tag) "useCheckboxProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useCheckboxProps(props: Partial<ICheckboxProps>, size?: Size): Partial<ICheckboxProps>;

// Warning: (ae-missing-release-tag) "useChoiceGroupProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useChoiceGroupProps(props: Partial<IChoiceGroupProps>, size?: Size): Partial<IChoiceGroupProps>;

// Warning: (ae-missing-release-tag) "useColorPickerProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useColorPickerProps(props: Partial<IColorPickerProps>, size?: Size): Partial<IColorPickerProps>;

// Warning: (ae-missing-release-tag) "useDropdownProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useDropdownProps(props: Partial<IDropdownProps>, size?: Size): Partial<IDropdownProps>;

// Warning: (ae-missing-release-tag) "useIconButtonProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useIconButtonProps(props: IButtonProps, size?: Size): IButtonProps;

// Warning: (ae-missing-release-tag) "useLabelProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useLabelProps(props: Partial<ILabelProps>, size?: Size): Partial<ILabelProps>;

// Warning: (ae-missing-release-tag) "useNavProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useNavProps(props: Partial<INavProps>, size?: Size): Partial<INavProps>;

// Warning: (ae-missing-release-tag) "usePivotProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function usePivotProps(props: Partial<IPivotProps>, size?: Size): Partial<IPivotProps>;

// Warning: (ae-missing-release-tag) "useSliderProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useSliderProps(props: Partial<ISliderProps>, size?: Size): Partial<ISliderProps>;

// Warning: (ae-missing-release-tag) "useSpinButtonProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useSpinButtonProps(props: Partial<ISpinButtonProps>, size?: Size): Partial<ISpinButtonProps>;

// Warning: (ae-missing-release-tag) "useTextFieldProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useTextFieldProps(props: Partial<ITextFieldProps>, size?: Size): Partial<ITextFieldProps>;

// Warning: (ae-missing-release-tag) "useToggleProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function useToggleProps(props: Partial<IToggleProps>, size?: Size): Partial<IToggleProps>;

// Warning: (ae-internal-missing-underscore) The name "WcpConsent" should be prefixed with an underscore because the declaration is marked as @internal
//
// @internal (undocumented)
export type WcpConsent = {
    init: (culture: string, placeholderIdOrElement: string | HTMLElement, initCallback?: (err?: Error, siteConsent?: CookieConsentManager) => void, onConsentChanged?: (newConsent: CookieConsent) => void, theme?: CookieConsentBannerThemes, stylesNonce?: string) => void;
};

// (No @packageDocumentation comment for this package)

```
