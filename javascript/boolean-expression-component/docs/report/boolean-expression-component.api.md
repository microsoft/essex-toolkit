## API Report File for "@essex/boolean-expression-component"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { CSSProperties } from 'react';
import type { ReactNode } from 'react';

// Warning: (ae-missing-release-tag) "BooleanOperation" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum BooleanOperation {
    // (undocumented)
    AND = "and",
    // (undocumented)
    OR = "or"
}

// Warning: (ae-missing-release-tag) "BooleanOperationMap" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface BooleanOperationMap {
    // (undocumented)
    __global__: BooleanOperation;
    // (undocumented)
    [key: string]: BooleanOperation;
}

// Warning: (ae-missing-release-tag) "BooleanOperationToggle" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const BooleanOperationToggle: React.FC<{
    className?: string;
    style?: CSSProperties;
    operation: BooleanOperation;
    disabled?: boolean;
    onToggle?: () => void;
    palette?: Palette;
}>;

// Warning: (ae-missing-release-tag) "DEFAULT_PALETTE" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const DEFAULT_PALETTE: Palette;

// Warning: (ae-missing-release-tag) "FilterClause" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface FilterClause {
    // (undocumented)
    id: string;
    // (undocumented)
    label: string;
}

// Warning: (ae-missing-release-tag) "FilterClauseGroup" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface FilterClauseGroup {
    // (undocumented)
    filters: FilterClause[];
    // (undocumented)
    id: string;
    // (undocumented)
    label: string;
    // (undocumented)
    locked?: boolean;
    // (undocumented)
    operation: BooleanOperation;
}

// Warning: (ae-missing-release-tag) "FilterExpressionView" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const FilterExpressionView: React.FC<{
    filters: FilterClauseGroup[];
    operation: BooleanOperation;
    palette?: Palette;
    onGlobalOperationChanged?: (data: BooleanOperation) => void;
    onChipDismissed?: (filter: FilterClause) => void;
    onOperationChanged?: (id: string, operation: BooleanOperation) => void;
    onChipGroupDismissed?: (filterGroup: FilterClauseGroup) => void;
}>;

// Warning: (ae-missing-release-tag) "NO_OP" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const NO_OP: () => void;

// Warning: (ae-missing-release-tag) "Palette" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface Palette {
    // (undocumented)
    backgroundColor: string;
    // (undocumented)
    operations: {
        [BooleanOperation.AND]: string;
        [BooleanOperation.OR]: string;
    };
}

// Warning: (ae-missing-release-tag) "toggleOperation" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function toggleOperation(op: BooleanOperation): BooleanOperation;

// Warning: (ae-missing-release-tag) "WithChildren" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface WithChildren {
    // (undocumented)
    children?: ReactNode;
}

// (No @packageDocumentation comment for this package)

```
