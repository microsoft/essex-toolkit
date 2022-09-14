/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { createElement } from 'react'

export interface DefaultsObject {
	id?: string
	className?: string
	style?: React.CSSProperties
	children?: React.ReactNode
}

export type Defaulted<P, D> = Partial<P & D> & Omit<P, keyof D>

export default function semantic<P, D extends DefaultsObject>(
	decorated: string | React.ComponentClass<P> | React.FunctionComponent<P>,
	defaults?: D,
): React.FunctionComponent<Defaulted<P, D>> {
	const DecoratedComponent: React.FC<Defaulted<P, D>> = (
		props: Defaulted<P, D>,
	) => {
		return createElement(
			decorated as
				| string
				| React.ComponentClass<unknown>
				| React.FunctionComponent<unknown>,
			{
				...defaults,
				...props,
				className: cx(defaults?.className, props.className),
			} as any,
		)
	}
	return DecoratedComponent
}

type HP<T = HTMLElement> = React.HTMLProps<T>
semantic.a = (d?: HP<HTMLAnchorElement>) => semantic('a', d)
semantic.abbr = (d?: HP) => semantic('abbr', d)
semantic.address = (d?: HP) => semantic('address', d)
semantic.area = (d?: HP<HTMLAreaElement>) => semantic('area', d)
semantic.article = (d?: HP) => semantic('article', d)
semantic.aside = (d?: HP) => semantic('aside', d)
semantic.audio = (d?: HP<HTMLAudioElement>) => semantic('audio', d)
semantic.b = (d?: HP) => semantic('b', d)
semantic.base = (d?: HP<HTMLBaseElement>) => semantic('base', d)
semantic.bdi = (d?: HP) => semantic('bdi', d)
semantic.bdo = (d?: HP) => semantic('bdo', d)
semantic.big = (d?: HP) => semantic('big', d)
semantic.blockquote = (d?: HP) => semantic('blockquote', d)
semantic.body = (d?: HP<HTMLBodyElement>) => semantic('body', d)
semantic.br = (d?: HP<HTMLBRElement>) => semantic('br', d)
semantic.button = (d?: HP<HTMLButtonElement>) => semantic('button', d)
semantic.canvas = (d?: HP<HTMLCanvasElement>) => semantic('canvas', d)
semantic.caption = (d?: HP) => semantic('caption', d)
semantic.cite = (d?: HP) => semantic('cite', d)
semantic.code = (d?: HP) => semantic('code', d)
semantic.col = (d?: HP<HTMLTableColElement>) => semantic('col', d)
semantic.colgroup = (d?: HP<HTMLTableColElement>) => semantic('colgroup', d)
semantic.data = (d?: HP<HTMLDataElement>) => semantic('data', d)
semantic.datalist = (d?: HP<HTMLDataListElement>) => semantic('datalist', d)
semantic.dd = (d?: HP) => semantic('dd', d)
semantic.del = (d?: HP) => semantic('del', d)
semantic.details = (d?: HP) => semantic('details', d)
semantic.dfn = (d?: HP) => semantic('dfn', d)
semantic.dialog = (d?: HP<HTMLDialogElement>) => semantic('dialog', d)
semantic.div = (d?: HP<HTMLDivElement>) => semantic('div', d)
semantic.dl = (d?: HP<HTMLDListElement>) => semantic('dl', d)
semantic.dt = (d?: HP) => semantic('dt', d)
semantic.em = (d?: HP) => semantic('em', d)
semantic.embed = (d?: HP<HTMLEmbedElement>) => semantic('embed', d)
semantic.fieldset = (d?: HP<HTMLFieldSetElement>) => semantic('fieldset', d)
semantic.figcaption = (d?: HP) => semantic('figcaption', d)
semantic.figure = (d?: HP) => semantic('figure', d)
semantic.footer = (d?: HP) => semantic('footer', d)
semantic.form = (d?: HP<HTMLFormElement>) => semantic('form', d)
semantic.h1 = (d?: HP<HTMLHeadingElement>) => semantic('h1', d)
semantic.h2 = (d?: HP<HTMLHeadingElement>) => semantic('h2', d)
semantic.h3 = (d?: HP<HTMLHeadingElement>) => semantic('h3', d)
semantic.h4 = (d?: HP<HTMLHeadingElement>) => semantic('h4', d)
semantic.h5 = (d?: HP<HTMLHeadingElement>) => semantic('h5', d)
semantic.h6 = (d?: HP<HTMLHeadingElement>) => semantic('h6', d)
semantic.head = (d?: HP) => semantic('head', d)
semantic.header = (d?: HP) => semantic('header', d)
semantic.hgroup = (d?: HP) => semantic('hgroup', d)
semantic.hr = (d?: HP<HTMLHRElement>) => semantic('hr', d)
semantic.html = (d?: HP) => semantic('html', d)
semantic.i = (d?: HP) => semantic('i', d)
semantic.iframe = (d?: HP<HTMLIFrameElement>) => semantic('iframe', d)
semantic.img = (d?: HP<HTMLImageElement>) => semantic('img', d)
semantic.input = (d?: HP<HTMLInputElement>) => semantic('input', d)
semantic.ins = (d?: HP<HTMLModElement>) => semantic('ins', d)
semantic.kbd = (d?: HP) => semantic('kbd', d)
semantic.keygen = (d?: HP) => semantic('keygen', d)
semantic.label = (d?: HP<HTMLLabelElement>) => semantic('label', d)
semantic.legend = (d?: HP<HTMLLegendElement>) => semantic('legend', d)
semantic.li = (d?: HP<HTMLLIElement>) => semantic('li', d)
semantic.link = (d?: HP<HTMLLinkElement>) => semantic('link', d)
semantic.main = (d?: HP) => semantic('main', d)
semantic.map = (d?: HP<HTMLMapElement>) => semantic('map', d)
semantic.mark = (d?: HP) => semantic('mark', d)
semantic.menu = (d?: HP) => semantic('menu', d)
semantic.menuitem = (d?: HP) => semantic('menuitem', d)
semantic.meta = (d?: HP<HTMLMetaElement>) => semantic('meta', d)
semantic.meter = (d?: HP) => semantic('meter', d)
semantic.nav = (d?: HP) => semantic('nav', d)
semantic.noscript = (d?: HP) => semantic('noscript', d)
semantic.object = (d?: HP<HTMLObjectElement>) => semantic('object', d)
semantic.ol = (d?: HP<HTMLOListElement>) => semantic('ol', d)
semantic.optgroup = (d?: HP<HTMLOptGroupElement>) => semantic('optgroup', d)
semantic.option = (d?: HP<HTMLOptionElement>) => semantic('option', d)
semantic.output = (d?: HP) => semantic('output', d)
semantic.p = (d?: HP<HTMLParagraphElement>) => semantic('p', d)
semantic.param = (d?: HP<HTMLParamElement>) => semantic('param', d)
semantic.picture = (d?: HP) => semantic('picture', d)
semantic.pre = (d?: HP<HTMLPreElement>) => semantic('pre', d)
semantic.progress = (d?: HP<HTMLProgressElement>) => semantic('progress', d)
semantic.q = (d?: HP<HTMLQuoteElement>) => semantic('q', d)
semantic.rp = (d?: HP) => semantic('rp', d)
semantic.rt = (d?: HP) => semantic('rt', d)
semantic.ruby = (d?: HP) => semantic('ruby', d)
semantic.s = (d?: HP) => semantic('s', d)
semantic.samp = (d?: HP) => semantic('samp', d)
semantic.slot = (d?: HP<HTMLSlotElement>) => semantic('slot', d)
semantic.script = (d?: HP<HTMLScriptElement>) => semantic('script', d)
semantic.section = (d?: HP) => semantic('section', d)
semantic.select = (d?: HP<HTMLSelectElement>) => semantic('select', d)
semantic.small = (d?: HP) => semantic('small', d)
semantic.source = (d?: HP<HTMLSourceElement>) => semantic('source', d)
semantic.span = (d?: HP<HTMLSpanElement>) => semantic('span', d)
semantic.strong = (d?: HP) => semantic('strong', d)
semantic.style = (d?: HP<HTMLStyleElement>) => semantic('style', d)
semantic.sub = (d?: HP) => semantic('sub', d)
semantic.summary = (d?: HP) => semantic('summary', d)
semantic.sup = (d?: HP) => semantic('sup', d)
semantic.table = (d?: HP<HTMLTableElement>) => semantic('table', d)
semantic.template = (d?: HP<HTMLTemplateElement>) => semantic('template', d)
semantic.tbody = (d?: HP<HTMLTableSectionElement>) => semantic('tbody', d)
semantic.td = (d?: HP<HTMLTableDataCellElement>) => semantic('td', d)
semantic.textarea = (d?: HP<HTMLTextAreaElement>) => semantic('textarea', d)
semantic.tfoot = (d?: HP<HTMLTableSectionElement>) => semantic('tfoot', d)
semantic.th = (d?: HP<HTMLTableHeaderCellElement>) => semantic('th', d)
semantic.thead = (d?: HP<HTMLTableSectionElement>) => semantic('thead', d)
semantic.time = (d?: HP) => semantic('time', d)
semantic.title = (d?: HP<HTMLTitleElement>) => semantic('title', d)
semantic.tr = (d?: HP<HTMLTableRowElement>) => semantic('tr', d)
semantic.track = (d?: HP<HTMLTrackElement>) => semantic('track', d)
semantic.u = (d?: HP) => semantic('u', d)
semantic.ul = (d?: HP<HTMLUListElement>) => semantic('ul', d)
semantic.var = (d?: HP) => semantic('var', d)
semantic.video = (d?: HP<HTMLVideoElement>) => semantic('video', d)
semantic.wbr = (d?: HP) => semantic('wbr', d)
semantic.webview = (d?: HP<HTMLWebViewElement>) => semantic('webview', d)
