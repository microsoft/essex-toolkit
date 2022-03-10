## API Report File for "@essex/toolbox"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// Warning: (ae-missing-release-tag) "Bin" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface Bin extends Array<number> {
    x0: number;
    x1: number;
}

// Warning: (ae-missing-release-tag) "binarySearch" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function binarySearch<T = number>(array: T[], item: T, compare?: typeof DEFAULT_COMPARE): number;

// Warning: (ae-missing-release-tag) "DEFAULT_COMPARE" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function DEFAULT_COMPARE<T>(item1: T, item2: T): number;

// Warning: (ae-missing-release-tag) "Deferred" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface Deferred<PromiseType> {
    promise: Promise<PromiseType>;
    reject(...args: any[]): Promise<PromiseType>;
    resolve(...args: any[]): Promise<PromiseType>;
}

// Warning: (ae-missing-release-tag) "deferred" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function deferred<T>(): Deferred<T>;

// Warning: (ae-missing-release-tag) "delay" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function delay(myDelay: number): Promise<any>;

// Warning: (ae-missing-release-tag) "Dictionary" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export type Dictionary<Value> = HashMap<Value>;

// Warning: (ae-missing-release-tag) "EventEmitter" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export class EventEmitter {
    emit(name: string, ...args: any[]): void;
    off(key: string, handler?: Handler): void;
    // Warning: (ae-forgotten-export) The symbol "Handler" needs to be exported by the entry point index.d.ts
    // Warning: (ae-forgotten-export) The symbol "DestroyObject" needs to be exported by the entry point index.d.ts
    on(key: string, handler?: Handler): DestroyObject | undefined;
}

// Warning: (ae-missing-release-tag) "eventEmitter" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const eventEmitter: () => EventEmitter;

// Warning: (ae-missing-release-tag) "flatMap" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function flatMap(arr: any[][]): any[];

// Warning: (ae-missing-release-tag) "HashMap" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface HashMap<Value = any> {
    // (undocumented)
    [key: string]: Value;
    // (undocumented)
    [key: number]: Value;
}

// Warning: (ae-missing-release-tag) "Histogram" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export type Histogram = Array<Bin>;

// Warning: (ae-missing-release-tag) "histogram" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const histogram: (data: any[], bins: number, accessor?: (d: any) => any, quantize?: boolean | undefined, smooth?: boolean | undefined) => Histogram;

// Warning: (ae-missing-release-tag) "interpolate" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const interpolate: (data: any[], multiple: number, accessor?: (d: any) => any) => number[];

// Warning: (ae-forgotten-export) The symbol "RGB" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "parseRgbFromCssColor" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function parseRgbFromCssColor(color: string): RGB;

// Warning: (ae-forgotten-export) The symbol "Options" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "throttle" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function throttle(func: (...args: any[]) => any, wait?: number, options?: Options): any;

// (No @packageDocumentation comment for this package)

```