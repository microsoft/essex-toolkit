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

semantic.a = (defaults?: React.HTMLProps<HTMLAnchorElement>) =>
	semantic('a', defaults)
semantic.abbr = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('abbr', defaults)
semantic.address = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('address', defaults)
semantic.area = (defaults?: React.HTMLProps<HTMLAreaElement>) =>
	semantic('area', defaults)
semantic.article = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('article', defaults)
semantic.aside = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('aside', defaults)
semantic.audio = (defaults?: React.HTMLProps<HTMLAudioElement>) =>
	semantic('audio', defaults)
semantic.b = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('b', defaults)
semantic.base = (defaults?: React.HTMLProps<HTMLBaseElement>) =>
	semantic('base', defaults)
semantic.bdi = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('bdi', defaults)
semantic.bdo = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('bdo', defaults)
semantic.big = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('big', defaults)
semantic.blockquote = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('blockquote', defaults)
semantic.body = (defaults?: React.HTMLProps<HTMLBodyElement>) =>
	semantic('body', defaults)
semantic.br = (defaults?: React.HTMLProps<HTMLBRElement>) =>
	semantic('br', defaults)
semantic.button = (defaults?: React.HTMLProps<HTMLButtonElement>) =>
	semantic('button', defaults)
semantic.canvas = (defaults?: React.HTMLProps<HTMLCanvasElement>) =>
	semantic('canvas', defaults)
semantic.caption = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('caption', defaults)
semantic.cite = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('cite', defaults)
semantic.code = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('code', defaults)
semantic.col = (defaults?: React.HTMLProps<HTMLTableColElement>) =>
	semantic('col', defaults)
semantic.colgroup = (defaults?: React.HTMLProps<HTMLTableColElement>) =>
	semantic('colgroup', defaults)
semantic.data = (defaults?: React.HTMLProps<HTMLDataElement>) =>
	semantic('data', defaults)
semantic.datalist = (defaults?: React.HTMLProps<HTMLDataListElement>) =>
	semantic('datalist', defaults)
semantic.dd = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('dd', defaults)
semantic.del = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('del', defaults)
semantic.details = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('details', defaults)
semantic.dfn = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('dfn', defaults)
semantic.dialog = (defaults?: React.HTMLProps<HTMLDialogElement>) =>
	semantic('dialog', defaults)
semantic.div = (defaults?: React.HTMLProps<HTMLDivElement>) =>
	semantic('div', defaults)
semantic.dl = (defaults?: React.HTMLProps<HTMLDListElement>) =>
	semantic('dl', defaults)
semantic.dt = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('dt', defaults)
semantic.em = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('em', defaults)
semantic.embed = (defaults?: React.HTMLProps<HTMLEmbedElement>) =>
	semantic('embed', defaults)
semantic.fieldset = (defaults?: React.HTMLProps<HTMLFieldSetElement>) =>
	semantic('fieldset', defaults)
semantic.figcaption = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('figcaption', defaults)
semantic.figure = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('figure', defaults)
semantic.footer = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('footer', defaults)
semantic.form = (defaults?: React.HTMLProps<HTMLFormElement>) =>
	semantic('form', defaults)
semantic.h1 = (defaults?: React.HTMLProps<HTMLHeadingElement>) =>
	semantic('h1', defaults)
semantic.h2 = (defaults?: React.HTMLProps<HTMLHeadingElement>) =>
	semantic('h2', defaults)
semantic.h3 = (defaults?: React.HTMLProps<HTMLHeadingElement>) =>
	semantic('h3', defaults)
semantic.h4 = (defaults?: React.HTMLProps<HTMLHeadingElement>) =>
	semantic('h4', defaults)
semantic.h5 = (defaults?: React.HTMLProps<HTMLHeadingElement>) =>
	semantic('h5', defaults)
semantic.h6 = (defaults?: React.HTMLProps<HTMLHeadingElement>) =>
	semantic('h6', defaults)
semantic.head = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('head', defaults)
semantic.header = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('header', defaults)
semantic.hgroup = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('hgroup', defaults)
semantic.hr = (defaults?: React.HTMLProps<HTMLHRElement>) =>
	semantic('hr', defaults)
semantic.html = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('html', defaults)
semantic.i = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('i', defaults)
semantic.iframe = (defaults?: React.HTMLProps<HTMLIFrameElement>) =>
	semantic('iframe', defaults)
semantic.img = (defaults?: React.HTMLProps<HTMLImageElement>) =>
	semantic('img', defaults)
semantic.input = (defaults?: React.HTMLProps<HTMLInputElement>) =>
	semantic('input', defaults)
semantic.ins = (defaults?: React.HTMLProps<HTMLModElement>) =>
	semantic('ins', defaults)
semantic.kbd = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('kbd', defaults)
semantic.keygen = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('keygen', defaults)
semantic.label = (defaults?: React.HTMLProps<HTMLLabelElement>) =>
	semantic('label', defaults)
semantic.legend = (defaults?: React.HTMLProps<HTMLLegendElement>) =>
	semantic('legend', defaults)
semantic.li = (defaults?: React.HTMLProps<HTMLLIElement>) =>
	semantic('li', defaults)
semantic.link = (defaults?: React.HTMLProps<HTMLLinkElement>) =>
	semantic('link', defaults)
semantic.main = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('main', defaults)
semantic.map = (defaults?: React.HTMLProps<HTMLMapElement>) =>
	semantic('map', defaults)
semantic.mark = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('mark', defaults)
semantic.menu = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('menu', defaults)
semantic.menuitem = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('menuitem', defaults)
semantic.meta = (defaults?: React.HTMLProps<HTMLMetaElement>) =>
	semantic('meta', defaults)
semantic.meter = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('meter', defaults)
semantic.nav = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('nav', defaults)
semantic.noscript = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('noscript', defaults)
semantic.object = (defaults?: React.HTMLProps<HTMLObjectElement>) =>
	semantic('object', defaults)
semantic.ol = (defaults?: React.HTMLProps<HTMLOListElement>) =>
	semantic('ol', defaults)
semantic.optgroup = (defaults?: React.HTMLProps<HTMLOptGroupElement>) =>
	semantic('optgroup', defaults)
semantic.option = (defaults?: React.HTMLProps<HTMLOptionElement>) =>
	semantic('option', defaults)
semantic.output = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('output', defaults)
semantic.p = (defaults?: React.HTMLProps<HTMLParagraphElement>) =>
	semantic('p', defaults)
semantic.param = (defaults?: React.HTMLProps<HTMLParamElement>) =>
	semantic('param', defaults)
semantic.picture = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('picture', defaults)
semantic.pre = (defaults?: React.HTMLProps<HTMLPreElement>) =>
	semantic('pre', defaults)
semantic.progress = (defaults?: React.HTMLProps<HTMLProgressElement>) =>
	semantic('progress', defaults)
semantic.q = (defaults?: React.HTMLProps<HTMLQuoteElement>) =>
	semantic('q', defaults)
semantic.rp = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('rp', defaults)
semantic.rt = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('rt', defaults)
semantic.ruby = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('ruby', defaults)
semantic.s = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('s', defaults)
semantic.samp = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('samp', defaults)
semantic.slot = (defaults?: React.HTMLProps<HTMLSlotElement>) =>
	semantic('slot', defaults)
semantic.script = (defaults?: React.HTMLProps<HTMLScriptElement>) =>
	semantic('script', defaults)
semantic.section = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('section', defaults)
semantic.select = (defaults?: React.HTMLProps<HTMLSelectElement>) =>
	semantic('select', defaults)
semantic.small = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('small', defaults)
semantic.source = (defaults?: React.HTMLProps<HTMLSourceElement>) =>
	semantic('source', defaults)
semantic.span = (defaults?: React.HTMLProps<HTMLSpanElement>) =>
	semantic('span', defaults)
semantic.strong = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('strong', defaults)
semantic.style = (defaults?: React.HTMLProps<HTMLStyleElement>) =>
	semantic('style', defaults)
semantic.sub = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('sub', defaults)
semantic.summary = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('summary', defaults)
semantic.sup = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('sup', defaults)
semantic.table = (defaults?: React.HTMLProps<HTMLTableElement>) =>
	semantic('table', defaults)
semantic.template = (defaults?: React.HTMLProps<HTMLTemplateElement>) =>
	semantic('template', defaults)
semantic.tbody = (defaults?: React.HTMLProps<HTMLTableSectionElement>) =>
	semantic('tbody', defaults)
semantic.td = (defaults?: React.HTMLProps<HTMLTableDataCellElement>) =>
	semantic('td', defaults)
semantic.textarea = (defaults?: React.HTMLProps<HTMLTextAreaElement>) =>
	semantic('textarea', defaults)
semantic.tfoot = (defaults?: React.HTMLProps<HTMLTableSectionElement>) =>
	semantic('tfoot', defaults)
semantic.th = (defaults?: React.HTMLProps<HTMLTableHeaderCellElement>) =>
	semantic('th', defaults)
semantic.thead = (defaults?: React.HTMLProps<HTMLTableSectionElement>) =>
	semantic('thead', defaults)
semantic.time = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('time', defaults)
semantic.title = (defaults?: React.HTMLProps<HTMLTitleElement>) =>
	semantic('title', defaults)
semantic.tr = (defaults?: React.HTMLProps<HTMLTableRowElement>) =>
	semantic('tr', defaults)
semantic.track = (defaults?: React.HTMLProps<HTMLTrackElement>) =>
	semantic('track', defaults)
semantic.u = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('u', defaults)
semantic.ul = (defaults?: React.HTMLProps<HTMLUListElement>) =>
	semantic('ul', defaults)
semantic.var = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('var', defaults)
semantic.video = (defaults?: React.HTMLProps<HTMLVideoElement>) =>
	semantic('video', defaults)
semantic.wbr = (defaults?: React.HTMLProps<HTMLElement>) =>
	semantic('wbr', defaults)
semantic.webview = (defaults?: React.HTMLProps<HTMLWebViewElement>) =>
	semantic('webview', defaults)
