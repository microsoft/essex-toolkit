## API Report File for "@essex/semantic-components"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { FunctionComponent } from 'react';

// Warning: (ae-missing-release-tag) "Defaulted" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type Defaulted<P, D> = Partial<P & D> & Omit<P, keyof D>;

// Warning: (ae-missing-release-tag) "DefaultsObject" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface DefaultsObject {
    // (undocumented)
    children?: React.ReactNode;
    // (undocumented)
    className?: string;
    // (undocumented)
    id?: string;
    // (undocumented)
    style?: React.CSSProperties;
}

// Warning: (ae-missing-release-tag) "semantic" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// Warning: (ae-missing-release-tag) "semantic" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
function semantic<P, D extends DefaultsObject>(decorated: string | React.ComponentClass<P> | React.FunctionComponent<P>, defaults?: D): React.FunctionComponent<Defaulted<P, D>>;

// @public (undocumented)
namespace semantic {
    var // Warning: (ae-forgotten-export) The symbol "HP" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    a: (d?: HP<HTMLAnchorElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLAnchorElement>>>;
    var // (undocumented)
    abbr: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    address: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    area: (d?: HP<HTMLAreaElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLAreaElement>>>;
    var // (undocumented)
    article: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    aside: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    audio: (d?: HP<HTMLAudioElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLAudioElement>>>;
    var // (undocumented)
    b: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    base: (d?: HP<HTMLBaseElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLBaseElement>>>;
    var // (undocumented)
    bdi: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    bdo: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    big: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    blockquote: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    body: (d?: HP<HTMLBodyElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLBodyElement>>>;
    var // (undocumented)
    br: (d?: HP<HTMLBRElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLBRElement>>>;
    var // (undocumented)
    button: (d?: HP<HTMLButtonElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLButtonElement>>>;
    var // (undocumented)
    canvas: (d?: HP<HTMLCanvasElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLCanvasElement>>>;
    var // (undocumented)
    caption: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    cite: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    code: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    col: (d?: HP<HTMLTableColElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableColElement>>>;
    var // (undocumented)
    colgroup: (d?: HP<HTMLTableColElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableColElement>>>;
    var // (undocumented)
    data: (d?: HP<HTMLDataElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLDataElement>>>;
    var // (undocumented)
    datalist: (d?: HP<HTMLDataListElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLDataListElement>>>;
    var // (undocumented)
    dd: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    del: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    details: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    dfn: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    dialog: (d?: HP<HTMLDialogElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLDialogElement>>>;
    var // (undocumented)
    div: (d?: HP<HTMLDivElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLDivElement>>>;
    var // (undocumented)
    dl: (d?: HP<HTMLDListElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLDListElement>>>;
    var // (undocumented)
    dt: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    em: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    embed: (d?: HP<HTMLEmbedElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLEmbedElement>>>;
    var // (undocumented)
    fieldset: (d?: HP<HTMLFieldSetElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLFieldSetElement>>>;
    var // (undocumented)
    figcaption: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    figure: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    footer: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    form: (d?: HP<HTMLFormElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLFormElement>>>;
    var // (undocumented)
    h1: (d?: HP<HTMLHeadingElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHeadingElement>>>;
    var // (undocumented)
    h2: (d?: HP<HTMLHeadingElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHeadingElement>>>;
    var // (undocumented)
    h3: (d?: HP<HTMLHeadingElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHeadingElement>>>;
    var // (undocumented)
    h4: (d?: HP<HTMLHeadingElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHeadingElement>>>;
    var // (undocumented)
    h5: (d?: HP<HTMLHeadingElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHeadingElement>>>;
    var // (undocumented)
    h6: (d?: HP<HTMLHeadingElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHeadingElement>>>;
    var // (undocumented)
    head: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    header: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    hgroup: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    hr: (d?: HP<HTMLHRElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLHRElement>>>;
    var // (undocumented)
    html: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    i: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    iframe: (d?: HP<HTMLIFrameElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLIFrameElement>>>;
    var // (undocumented)
    img: (d?: HP<HTMLImageElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLImageElement>>>;
    var // (undocumented)
    input: (d?: HP<HTMLInputElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLInputElement>>>;
    var // (undocumented)
    ins: (d?: HP<HTMLModElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLModElement>>>;
    var // (undocumented)
    kbd: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    keygen: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    label: (d?: HP<HTMLLabelElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLLabelElement>>>;
    var // (undocumented)
    legend: (d?: HP<HTMLLegendElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLLegendElement>>>;
    var // (undocumented)
    li: (d?: HP<HTMLLIElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLLIElement>>>;
    var // (undocumented)
    link: (d?: HP<HTMLLinkElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLLinkElement>>>;
    var // (undocumented)
    main: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    map: (d?: HP<HTMLMapElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLMapElement>>>;
    var // (undocumented)
    mark: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    menu: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    menuitem: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    meta: (d?: HP<HTMLMetaElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLMetaElement>>>;
    var // (undocumented)
    meter: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    nav: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    noscript: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    object: (d?: HP<HTMLObjectElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLObjectElement>>>;
    var // (undocumented)
    ol: (d?: HP<HTMLOListElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLOListElement>>>;
    var // (undocumented)
    optgroup: (d?: HP<HTMLOptGroupElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLOptGroupElement>>>;
    var // (undocumented)
    option: (d?: HP<HTMLOptionElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLOptionElement>>>;
    var // (undocumented)
    output: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    p: (d?: HP<HTMLParagraphElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLParagraphElement>>>;
    var // (undocumented)
    param: (d?: HP<HTMLParamElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLParamElement>>>;
    var // (undocumented)
    picture: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    pre: (d?: HP<HTMLPreElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLPreElement>>>;
    var // (undocumented)
    progress: (d?: HP<HTMLProgressElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLProgressElement>>>;
    var // (undocumented)
    q: (d?: HP<HTMLQuoteElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLQuoteElement>>>;
    var // (undocumented)
    rp: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    rt: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    ruby: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    s: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    samp: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    slot: (d?: HP<HTMLSlotElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLSlotElement>>>;
    var // (undocumented)
    script: (d?: HP<HTMLScriptElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLScriptElement>>>;
    var // (undocumented)
    section: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    select: (d?: HP<HTMLSelectElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLSelectElement>>>;
    var // (undocumented)
    small: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    source: (d?: HP<HTMLSourceElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLSourceElement>>>;
    var // (undocumented)
    span: (d?: HP<HTMLSpanElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLSpanElement>>>;
    var // (undocumented)
    strong: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    style: (d?: HP<HTMLStyleElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLStyleElement>>>;
    var // (undocumented)
    sub: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    summary: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    sup: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    table: (d?: HP<HTMLTableElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableElement>>>;
    var // (undocumented)
    template: (d?: HP<HTMLTemplateElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTemplateElement>>>;
    var // (undocumented)
    tbody: (d?: HP<HTMLTableSectionElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableSectionElement>>>;
    var // (undocumented)
    td: (d?: HP<HTMLTableDataCellElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableDataCellElement>>>;
    var // (undocumented)
    textarea: (d?: HP<HTMLTextAreaElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTextAreaElement>>>;
    var // (undocumented)
    tfoot: (d?: HP<HTMLTableSectionElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableSectionElement>>>;
    var // (undocumented)
    th: (d?: HP<HTMLTableHeaderCellElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableHeaderCellElement>>>;
    var // (undocumented)
    thead: (d?: HP<HTMLTableSectionElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableSectionElement>>>;
    var // (undocumented)
    time: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    title: (d?: HP<HTMLTitleElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTitleElement>>>;
    var // (undocumented)
    tr: (d?: HP<HTMLTableRowElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTableRowElement>>>;
    var // (undocumented)
    track: (d?: HP<HTMLTrackElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLTrackElement>>>;
    var // (undocumented)
    u: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    ul: (d?: HP<HTMLUListElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLUListElement>>>;
    var // (undocumented)
    _a: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    video: (d?: HP<HTMLVideoElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLVideoElement>>>;
    var // (undocumented)
    wbr: (d?: HP) => FunctionComponent<Defaulted<unknown, HP<HTMLElement>>>;
    var // (undocumented)
    webview: (d?: HP<HTMLWebViewElement>) => FunctionComponent<Defaulted<unknown, HP<HTMLWebViewElement>>>;
        { _a as var };
}
export default semantic;

// (No @packageDocumentation comment for this package)

```
