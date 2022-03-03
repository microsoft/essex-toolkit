/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createElement } from 'react'
export interface DefaultsObject {
	id?: string
	className?: string
	style?: React.CSSProperties
	children?: React.ReactNode
}

export type Defaulted<P, D> = Partial<P & D> & Omit<P, keyof D>

export default function semantic<P, D>(
	decorated: string | React.ComponentClass<P> | React.FunctionComponent<P>,
	defaults?: D,
): React.FunctionComponent<Defaulted<P, D>> {
	const DecoratedComponent: React.FC<Defaulted<P, D>> = (
		props: Defaulted<P, D>,
	) => {
		return createElement(decorated, { ...defaults, ...props } as any)
	}
	return DecoratedComponent
}

semantic.a = (d?: React.HTMLProps<HTMLAnchorElement>) => semantic('a', d)
semantic.abbr = (d?: React.HTMLProps<HTMLElement>) => semantic('abbr', d)
semantic.address = (d?: React.HTMLProps<HTMLElement>) => semantic('address', d)
semantic.area = (d?: React.HTMLProps<HTMLAreaElement>) => semantic('area', d)
semantic.article = (d?: React.HTMLProps<HTMLElement>) => semantic('article', d)
semantic.aside = (d?: React.HTMLProps<HTMLElement>) => semantic('aside', d)
semantic.audio = (d?: React.HTMLProps<HTMLAudioElement>) => semantic('audio', d)
semantic.b = (d?: React.HTMLProps<HTMLElement>) => semantic('b', d)
semantic.base = (d?: React.HTMLProps<HTMLBaseElement>) => semantic('base', d)
semantic.bdi = (d?: React.HTMLProps<HTMLElement>) => semantic('bdi', d)
semantic.bdo = (d?: React.HTMLProps<HTMLElement>) => semantic('bdo', d)
semantic.big = (d?: React.HTMLProps<HTMLElement>) => semantic('big', d)
semantic.blockquote = (d?: React.HTMLProps<HTMLElement>) =>
	semantic('blockquote', d)
semantic.body = (d?: React.HTMLProps<HTMLBodyElement>) => semantic('body', d)
semantic.br = (d?: React.HTMLProps<HTMLBRElement>) => semantic('br', d)
semantic.button = (d?: React.HTMLProps<HTMLButtonElement>) =>
	semantic('button', d)
semantic.canvas = (d?: React.HTMLProps<HTMLCanvasElement>) =>
	semantic('canvas', d)
semantic.caption = (d?: React.HTMLProps<HTMLElement>) => semantic('caption', d)
semantic.cite = (d?: React.HTMLProps<HTMLElement>) => semantic('cite', d)
semantic.code = (d?: React.HTMLProps<HTMLElement>) => semantic('code', d)
semantic.col = (d?: React.HTMLProps<HTMLTableColElement>) => semantic('col', d)
semantic.colgroup = (d?: React.HTMLProps<HTMLTableColElement>) =>
	semantic('colgroup', d)
semantic.data = (d?: React.HTMLProps<HTMLDataElement>) => semantic('data', d)
semantic.datalist = (d?: React.HTMLProps<HTMLDataListElement>) =>
	semantic('datalist', d)
semantic.dd = (d?: React.HTMLProps<HTMLElement>) => semantic('dd', d)
semantic.del = (d?: React.HTMLProps<HTMLElement>) => semantic('del', d)
semantic.details = (d?: React.HTMLProps<HTMLElement>) => semantic('details', d)
semantic.dfn = (d?: React.HTMLProps<HTMLElement>) => semantic('dfn', d)
semantic.dialog = (d?: React.HTMLProps<HTMLDialogElement>) =>
	semantic('dialog', d)
semantic.div = (d?: React.HTMLProps<HTMLDivElement>) => semantic('div', d)
semantic.dl = (d?: React.HTMLProps<HTMLDListElement>) => semantic('dl', d)
semantic.dt = (d?: React.HTMLProps<HTMLElement>) => semantic('dt', d)
semantic.em = (d?: React.HTMLProps<HTMLElement>) => semantic('em', d)
semantic.embed = (d?: React.HTMLProps<HTMLEmbedElement>) => semantic('embed', d)
semantic.fieldset = (d?: React.HTMLProps<HTMLFieldSetElement>) =>
	semantic('fieldset', d)
semantic.figcaption = (d?: React.HTMLProps<HTMLElement>) =>
	semantic('figcaption', d)
semantic.figure = (d?: React.HTMLProps<HTMLElement>) => semantic('figure', d)
semantic.footer = (d?: React.HTMLProps<HTMLElement>) => semantic('footer', d)
semantic.form = (d?: React.HTMLProps<HTMLFormElement>) => semantic('form', d)
semantic.h1 = (d?: React.HTMLProps<HTMLHeadingElement>) => semantic('h1', d)
semantic.h2 = (d?: React.HTMLProps<HTMLHeadingElement>) => semantic('h2', d)
semantic.h3 = (d?: React.HTMLProps<HTMLHeadingElement>) => semantic('h3', d)
semantic.h4 = (d?: React.HTMLProps<HTMLHeadingElement>) => semantic('h4', d)
semantic.h5 = (d?: React.HTMLProps<HTMLHeadingElement>) => semantic('h5', d)
semantic.h6 = (d?: React.HTMLProps<HTMLHeadingElement>) => semantic('h6', d)
semantic.head = (d?: React.HTMLProps<HTMLElement>) => semantic('head', d)
semantic.header = (d?: React.HTMLProps<HTMLElement>) => semantic('header', d)
semantic.hgroup = (d?: React.HTMLProps<HTMLElement>) => semantic('hgroup', d)
semantic.hr = (d?: React.HTMLProps<HTMLHRElement>) => semantic('hr', d)
semantic.html = (d?: React.HTMLProps<HTMLElement>) => semantic('html', d)
semantic.i = (d?: React.HTMLProps<HTMLElement>) => semantic('i', d)
semantic.iframe = (d?: React.HTMLProps<HTMLIFrameElement>) =>
	semantic('iframe', d)
semantic.img = (d?: React.HTMLProps<HTMLImageElement>) => semantic('img', d)
semantic.input = (d?: React.HTMLProps<HTMLInputElement>) => semantic('input', d)
semantic.ins = (d?: React.HTMLProps<HTMLModElement>) => semantic('ins', d)
semantic.kbd = (d?: React.HTMLProps<HTMLElement>) => semantic('kbd', d)
semantic.keygen = (d?: React.HTMLProps<HTMLElement>) => semantic('keygen', d)
semantic.label = (d?: React.HTMLProps<HTMLLabelElement>) => semantic('label', d)
semantic.legend = (d?: React.HTMLProps<HTMLLegendElement>) =>
	semantic('legend', d)
semantic.li = (d?: React.HTMLProps<HTMLLIElement>) => semantic('li', d)
semantic.link = (d?: React.HTMLProps<HTMLLinkElement>) => semantic('link', d)
semantic.main = (d?: React.HTMLProps<HTMLElement>) => semantic('main', d)
semantic.map = (d?: React.HTMLProps<HTMLMapElement>) => semantic('map', d)
semantic.mark = (d?: React.HTMLProps<HTMLElement>) => semantic('mark', d)
semantic.menu = (d?: React.HTMLProps<HTMLElement>) => semantic('menu', d)
semantic.menuitem = (d?: React.HTMLProps<HTMLElement>) =>
	semantic('menuitem', d)
semantic.meta = (d?: React.HTMLProps<HTMLMetaElement>) => semantic('meta', d)
semantic.meter = (d?: React.HTMLProps<HTMLElement>) => semantic('meter', d)
semantic.nav = (d?: React.HTMLProps<HTMLElement>) => semantic('nav', d)
semantic.noscript = (d?: React.HTMLProps<HTMLElement>) =>
	semantic('noscript', d)
semantic.object = (d?: React.HTMLProps<HTMLObjectElement>) =>
	semantic('object', d)
semantic.ol = (d?: React.HTMLProps<HTMLOListElement>) => semantic('ol', d)
semantic.optgroup = (d?: React.HTMLProps<HTMLOptGroupElement>) =>
	semantic('optgroup', d)
semantic.option = (d?: React.HTMLProps<HTMLOptionElement>) =>
	semantic('option', d)
semantic.output = (d?: React.HTMLProps<HTMLElement>) => semantic('output', d)
semantic.p = (d?: React.HTMLProps<HTMLParagraphElement>) => semantic('p', d)
semantic.param = (d?: React.HTMLProps<HTMLParamElement>) => semantic('param', d)
semantic.picture = (d?: React.HTMLProps<HTMLElement>) => semantic('picture', d)
semantic.pre = (d?: React.HTMLProps<HTMLPreElement>) => semantic('pre', d)
semantic.progress = (d?: React.HTMLProps<HTMLProgressElement>) =>
	semantic('progress', d)
semantic.q = (d?: React.HTMLProps<HTMLQuoteElement>) => semantic('q', d)
semantic.rp = (d?: React.HTMLProps<HTMLElement>) => semantic('rp', d)
semantic.rt = (d?: React.HTMLProps<HTMLElement>) => semantic('rt', d)
semantic.ruby = (d?: React.HTMLProps<HTMLElement>) => semantic('ruby', d)
semantic.s = (d?: React.HTMLProps<HTMLElement>) => semantic('s', d)
semantic.samp = (d?: React.HTMLProps<HTMLElement>) => semantic('samp', d)
semantic.slot = (d?: React.HTMLProps<HTMLSlotElement>) => semantic('slot', d)
semantic.script = (d?: React.HTMLProps<HTMLScriptElement>) =>
	semantic('script', d)
semantic.section = (d?: React.HTMLProps<HTMLElement>) => semantic('section', d)
semantic.select = (d?: React.HTMLProps<HTMLSelectElement>) =>
	semantic('select', d)
semantic.small = (d?: React.HTMLProps<HTMLElement>) => semantic('small', d)
semantic.source = (d?: React.HTMLProps<HTMLSourceElement>) =>
	semantic('source', d)
semantic.span = (d?: React.HTMLProps<HTMLSpanElement>) => semantic('span', d)
semantic.strong = (d?: React.HTMLProps<HTMLElement>) => semantic('strong', d)
semantic.style = (d?: React.HTMLProps<HTMLStyleElement>) => semantic('style', d)
semantic.sub = (d?: React.HTMLProps<HTMLElement>) => semantic('sub', d)
semantic.summary = (d?: React.HTMLProps<HTMLElement>) => semantic('summary', d)
semantic.sup = (d?: React.HTMLProps<HTMLElement>) => semantic('sup', d)
semantic.table = (d?: React.HTMLProps<HTMLTableElement>) => semantic('table', d)
semantic.template = (d?: React.HTMLProps<HTMLTemplateElement>) =>
	semantic('template', d)
semantic.tbody = (d?: React.HTMLProps<HTMLTableSectionElement>) =>
	semantic('tbody', d)
semantic.td = (d?: React.HTMLProps<HTMLTableDataCellElement>) =>
	semantic('td', d)
semantic.textarea = (d?: React.HTMLProps<HTMLTextAreaElement>) =>
	semantic('textarea', d)
semantic.tfoot = (d?: React.HTMLProps<HTMLTableSectionElement>) =>
	semantic('tfoot', d)
semantic.th = (d?: React.HTMLProps<HTMLTableHeaderCellElement>) =>
	semantic('th', d)
semantic.thead = (d?: React.HTMLProps<HTMLTableSectionElement>) =>
	semantic('thead', d)
semantic.time = (d?: React.HTMLProps<HTMLElement>) => semantic('time', d)
semantic.title = (d?: React.HTMLProps<HTMLTitleElement>) => semantic('title', d)
semantic.tr = (d?: React.HTMLProps<HTMLTableRowElement>) => semantic('tr', d)
semantic.track = (d?: React.HTMLProps<HTMLTrackElement>) => semantic('track', d)
semantic.u = (d?: React.HTMLProps<HTMLElement>) => semantic('u', d)
semantic.ul = (d?: React.HTMLProps<HTMLUListElement>) => semantic('ul', d)
semantic.var = (d?: React.HTMLProps<HTMLElement>) => semantic('var', d)
semantic.video = (d?: React.HTMLProps<HTMLVideoElement>) => semantic('video', d)
semantic.wbr = (d?: React.HTMLProps<HTMLElement>) => semantic('wbr', d)
semantic.webview = (d?: React.HTMLProps<HTMLWebViewElement>) =>
	semantic('webview', d)
