/**
 * Turns a component's HTML template into a custom element, <govuk-app-NAME>.
 *
 * No build step: the component's .html file is fetched when the page runs,
 * and its <template> is filled in from the element's attributes and content
 * every time one of them changes.
 *
 * Light DOM, no shadow DOM: the component's stylesheet styles what it draws,
 * and the element itself is `display: contents`, set here for every element,
 * so it takes no part in layout. Components send no events of their own: they
 * draw the browser's own controls, whose events (click, input, change) bubble
 * as usual.
 *
 * A template is plain HTML inside <template>, with attributes that say how
 * it is filled in. Each names one value of the data the component prepares:
 *
 *   data-text="x"          the element's text is x
 *   data-attr="a: x, b: y" attribute a is x. true sets it empty; false, null
 *                          and undefined leave it off
 *   data-if="x"            the element is left out unless x is present: not
 *                          false, null, undefined, '' or []
 *   data-slot="content"    the element holds what was written between the
 *                          component's tags
 *   data-tag="x: h1 h2"    the element's tag is x, if it is one of those
 *                          listed, and as written otherwise
 *
 * These are the same attributes as the app prototyping system's kit
 * (exploration-2/kit), so a template written for one reads the same in the
 * other. Its data-each is not supported yet.
 */

// What a root with highlight-actions does, for any page that uses a component.
import './highlight-actions.js'

/**
 * The icons' font: Material Symbols Rounded, filled, in place of SF Symbols,
 * which may only be used on Apple's platforms. A component that draws icons
 * names it in its fonts. The font is in foundation/fonts, so nothing is
 * loaded from another site.
 */
export const materialSymbols = {
  family: 'Material Symbols Rounded',
  stylesheet: new URL('./fonts/material-symbols-rounded.css', import.meta.url),
}

/**
 * Material Symbols Outlined, filled, which the app's own topic icons are
 * drawn from.
 */
export const materialSymbolsOutlined = {
  family: 'Material Symbols Outlined',
  stylesheet: new URL('./fonts/material-symbols-outlined.css', import.meta.url),
}

const templates = new Map()
const stylesheets = new Map()

/** The foundation every component relies on: the tokens, and the root. */
const foundation = [new URL('./tokens.css', import.meta.url), new URL('./base.css', import.meta.url)]

/**
 * One rule for each component's element, `govuk-app-NAME { display: contents }`,
 * added as it is defined, so no component's stylesheet has to say it. CSS has
 * no selector for every element whose name starts govuk-app-.
 */
const elements = new CSSStyleSheet()
document.adoptedStyleSheets = [...document.adoptedStyleSheets, elements]

/**
 * Adds the stylesheet at `url` to the page once, at the end of <head> so it
 * comes after the page's own styles, and resolves when it has loaded.
 */
export function stylesheet(url) {
  const key = String(url)
  if (!stylesheets.has(key)) {
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: key })
    stylesheets.set(key, new Promise((resolve, reject) => {
      link.addEventListener('load', resolve, { once: true })
      link.addEventListener('error', () => reject(new Error(`Could not load the stylesheet ${key}`)), { once: true })
    }))
    document.head.append(link)
  }
  return stylesheets.get(key)
}

let fontsLoading = 0

/**
 * Marks the page while any font is loading, so base.css can hide icons,
 * which would otherwise show as their names in the page's own font.
 */
function fontLoading(change) {
  fontsLoading += change
  document.documentElement.toggleAttribute('data-govuk-app-fonts-loading', fontsLoading > 0)
}

/**
 * Adds a font's stylesheet to the page once, and marks the page as loading
 * fonts until its font has loaded. Nothing waits for it, so a component is
 * drawn straight away, its icons hidden until then.
 */
function loadFont({ family, stylesheet: url }) {
  // Its stylesheet is only added here, so one already on the page is a font
  // already loading, or loaded.
  if (stylesheets.has(String(url))) return
  fontLoading(+1)
  stylesheet(url)
    // A stylesheet doesn't load its font until something uses it, so ask.
    .then(() => document.fonts.load(`24px "${family}"`))
    // If it can't be loaded, its icons show as their names: better than
    // nothing, as they say what they are.
    .catch(error => console.warn(`Could not load the font ${family}: ${error.message}`))
    .finally(() => fontLoading(-1))
}

/** The <template> in the HTML file at `url`, fetched once. */
function load(url) {
  const key = String(url)
  if (!templates.has(key)) {
    templates.set(key, fetch(url).then(async response => {
      if (!response.ok) throw new Error(`Could not load the template ${key}: ${response.status}`)
      const html = await response.text()
      const template = new DOMParser().parseFromString(html, 'text/html').querySelector('template')
      if (!template) throw new Error(`${key} has no <template>`)
      return template
    }))
  }
  return templates.get(key)
}

/**
 * Defines <govuk-app-NAME>.
 *
 *   name        the component's name: 'button' defines <govuk-app-button>
 *   template    the URL of its .html file
 *   styles      the URL of its .css file, added to the page with the
 *               foundation's, so a page only has to load the component's
 *               script
 *   attributes  the attributes it reads. Each becomes a value of the data,
 *               named in camelCase: an attribute given with no value is true,
 *               one left off is undefined
 *   prepare     turns that data into what the template is filled in from:
 *               defaults, and anything worked out from more than one value.
 *               It's given the element too, for idFor
 *   fonts       fonts it uses, such as materialSymbols, added to the page
 *               but not waited for: a font this size can take a moment, and
 *               the component would be drawn as bare text until then. Give
 *               anything drawn in an icon font the class govuk-app-icon,
 *               which base.css hides until every font has loaded, so it
 *               never shows as the icon's name
 *
 * The element is defined once its template and styles have loaded, so it is
 * never drawn unstyled.
 */
export async function defineComponent({ name, template, styles, attributes = [], prepare = data => data, fonts = [] }) {
  const tag = `govuk-app-${name}`
  // A page can load the same script twice, by two URLs that name it
  // differently, and each defines its element. Checking first saves loading
  // anything; checking again after catches the other having defined it while
  // this one waited, as defining a name twice throws.
  if (customElements.get(tag)) return
  const [source] = await Promise.all([
    load(template),
    ...[...foundation, ...(styles ? [styles] : [])].map(stylesheet),
  ])
  for (const font of fonts) loadFont(font)
  if (customElements.get(tag)) return

  elements.insertRule(`${tag} { display: contents; }`)
  customElements.define(tag, class extends HTMLElement {
    static observedAttributes = attributes
    #content = null

    connectedCallback() {
      // What was written between the tags, kept to put in the template's slot.
      if (this.#content === null) this.#content = [...this.childNodes]
      this.#draw()
    }

    attributeChangedCallback() {
      if (this.#content !== null) this.#draw()
    }

    #draw() {
      const data = { content: this.#content }
      for (const attribute of attributes) {
        const value = this.getAttribute(attribute)
        data[camelCase(attribute)] = value === null ? undefined : value === '' ? true : value
      }
      this.replaceChildren(fill(source.content.cloneNode(true), prepare(data, this)))
    }
  })
}

/*
 * What several components' prepare work out the same way, so each works it
 * out alike.
 */

/** Whether an attribute was given some text: not left off, and not empty. */
export function filled(value) {
  return typeof value === 'string' && value !== ''
}

/**
 * What was written between a component's tags, sorted by slot: each element
 * with slot="NAME", for each of `names`, under that name, and everything
 * else, text too, under rest. Each keeps the order it was written in.
 */
export function bySlot(content, ...names) {
  const parts = Object.fromEntries([...names, 'rest'].map(name => [name, []]))
  for (const node of content) {
    const slot = node.nodeType === Node.ELEMENT_NODE ? node.getAttribute('slot') : null
    parts[names.includes(slot) ? slot : 'rest'].push(node)
  }
  return parts
}

/**
 * A heading's level, from its level attribute: the one it names if that's
 * one of the `allowed`, and `fallback` otherwise. Each component says which
 * it allows, as not every one can take any level.
 */
export function headingLevel(value, allowed, fallback = 2) {
  const level = Number(value)
  return allowed.includes(level) ? level : fallback
}

/**
 * Whether something that can be pressed is drawn as a link or a button: a
 * link if it has an href, since it goes to another page, and a button
 * otherwise, for the page to act on. Neither if it isn't `shown`. Its
 * template has an <a data-if="link"> and a <button data-if="button">.
 */
export function linkOrButton(href, shown = true) {
  return { link: shown && href !== undefined, button: shown && href === undefined }
}

const ids = new WeakMap()
const idCounts = new Map()

/**
 * An id for something an element draws, unique on the page, such as a menu
 * its button opens. It's the same each time the element is drawn, so what
 * points at it, such as aria-describedby, isn't changed by a redraw.
 */
export function idFor(element, prefix) {
  if (!ids.has(element)) {
    const count = (idCounts.get(prefix) ?? 0) + 1
    idCounts.set(prefix, count)
    ids.set(element, `${prefix}-${count}`)
  }
  return ids.get(element)
}

/**
 * Pressing an `item` of a `group` that is a button selects it, and only it,
 * as a native tab bar or segmented control does. One that is a link goes to
 * its page instead, which marks its own item selected.
 */
export function selectOnPress(group, item) {
  document.addEventListener('click', event => {
    const pressed = event.target.closest?.(`${item}:not([href])`)
    const parent = pressed?.closest(group)
    if (!parent || pressed.hasAttribute('selected')) return
    for (const other of parent.querySelectorAll(`${item}[selected]`)) other.removeAttribute('selected')
    // Selecting it draws it again, so give focus back to its new button.
    const focused = pressed.contains(document.activeElement)
    pressed.setAttribute('selected', '')
    if (focused) pressed.querySelector('button').focus()
  })
}

/** Fills in a copy of a template's content from `data`. */
function fill(fragment, data) {
  // First, so the new element keeps the attributes the steps below read.
  for (const element of fragment.querySelectorAll('[data-tag]')) {
    const [property, choices = ''] = element.dataset.tag.split(':').map(part => part.trim())
    const tag = String(data[property] ?? '').toLowerCase()
    element.removeAttribute('data-tag')
    if (!choices.split(/\s+/).includes(tag) || tag === element.localName) continue
    const replacement = document.createElement(tag)
    for (const attribute of element.attributes) replacement.setAttribute(attribute.name, attribute.value)
    replacement.append(...element.childNodes)
    element.replaceWith(replacement)
  }
  for (const element of fragment.querySelectorAll('[data-if]')) {
    if (present(data[element.dataset.if])) element.removeAttribute('data-if')
    else element.remove()
  }
  for (const element of fragment.querySelectorAll('[data-attr]')) {
    for (const pair of element.dataset.attr.split(',')) {
      const [attribute, property] = pair.split(':').map(part => part.trim())
      const value = data[property]
      // Styles go through the CSSOM, not the attribute, so they still apply
      // under a Content Security Policy that blocks inline styles, as a
      // prototype viewer's does.
      if (attribute === 'style') setStyles(element, value)
      else if (value === true) element.setAttribute(attribute, '')
      else if (value !== false && value !== null && value !== undefined) element.setAttribute(attribute, String(value))
    }
    element.removeAttribute('data-attr')
  }
  for (const element of fragment.querySelectorAll('[data-text]')) {
    const value = data[element.dataset.text]
    element.textContent = value === null || value === undefined ? '' : String(value)
    element.removeAttribute('data-text')
  }
  for (const element of fragment.querySelectorAll('[data-slot]')) {
    const value = data[element.dataset.slot]
    element.replaceChildren(...(Array.isArray(value) ? value : value === undefined ? [] : [value]))
    element.removeAttribute('data-slot')
  }
  return fragment
}

/** Sets each declaration of `declarations`, such as `--x: 1; --y: 2`, on `element`. */
function setStyles(element, declarations) {
  if (typeof declarations !== 'string') return
  for (const declaration of declarations.split(';')) {
    const colon = declaration.indexOf(':')
    if (colon > 0) element.style.setProperty(declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim())
  }
}

function present(value) {
  return value !== undefined && value !== null && value !== false && value !== '' && !(Array.isArray(value) && value.length === 0)
}

function camelCase(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}
