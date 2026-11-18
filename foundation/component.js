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
 * draw the browser's own
 * controls, whose events (click, input, change) bubble as usual.
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
 * These are the same attributes as Shaun's kit (app-prototyping-system,
 * exploration-2/kit), so a template written for one reads the same in the
 * other. His data-each is not supported yet.
 */

/**
 * The icons' font: Material Symbols Rounded, filled, in place of SF Symbols,
 * which may only be used on Apple's platforms. A component that draws icons
 * names it in its fonts.
 */
export const materialSymbols = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=block'

/**
 * Material Symbols Outlined, filled, which the app's own topic icons are
 * drawn from.
 */
export const materialSymbolsOutlined = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0&display=block'

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
function stylesheet(url) {
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

const fontStylesheets = new Set()
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
 * Adds a font's stylesheet to the page once, without waiting for it. It's
 * fetched and added as a <style>, not a <link>: Chrome holds every
 * stylesheet's load event until those added before it have loaded, so a font
 * from another site, which can take a second or more, would hold back every
 * component still loading. Google Fonts' stylesheets may be fetched from any
 * site.
 */
function fontStylesheet(url) {
  const key = String(url)
  if (fontStylesheets.has(key)) return
  fontStylesheets.add(key)
  fontLoading(+1)
  fetch(key)
    .then(response => {
      if (!response.ok) throw new Error(`${response.status}`)
      return response.text()
    })
    .then(css => {
      document.head.append(Object.assign(document.createElement('style'), { textContent: css }))
      // A stylesheet doesn't load its fonts until something uses them, so
      // ask for each family it declares, and wait for them.
      const families = new Set([...css.matchAll(/font-family:\s*['"]([^'"]+)['"]/g)].map(match => match[1]))
      return Promise.all([...families].map(family => document.fonts.load(`24px "${family}"`)))
    })
    // If it can't be loaded, its icons show as their names: better than
    // nothing, as they say what they are.
    .catch(error => console.warn(`Could not load the font ${key}: ${error.message}`))
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
 *               defaults, and anything worked out from more than one value
 *   fonts       stylesheets of fonts it uses, such as materialSymbols, added
 *               to the page but not waited for: a font from another site can
 *               take a second or more, and the component would be drawn as
 *               bare text until then. Give anything drawn in an icon font
 *               the class govuk-app-icon, which base.css hides until every
 *               font has loaded, so it never shows as the icon's name
 *
 * The element is defined once its template and styles have loaded, so it is
 * never drawn unstyled.
 */
export async function defineComponent({ name, template, styles, attributes = [], prepare = data => data, fonts = [] }) {
  const tag = `govuk-app-${name}`
  if (customElements.get(tag)) return
  const [source] = await Promise.all([
    load(template),
    ...[...foundation, ...(styles ? [styles] : [])].map(stylesheet),
  ])
  for (const font of fonts) fontStylesheet(font)
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
      this.replaceChildren(fill(source.content.cloneNode(true), prepare(data)))
    }
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
      if (value === true) element.setAttribute(attribute, '')
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

function present(value) {
  return value !== undefined && value !== null && value !== false && value !== '' && !(Array.isArray(value) && value.length === 0)
}

function camelCase(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}
