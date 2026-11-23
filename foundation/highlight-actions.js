/**
 * Rings what works, for a moment, when a tap goes nowhere, inside a
 * <govuk-app highlight-actions>. A prototype only works where someone has
 * made it work, so this shows whoever is trying one what does. The app has
 * nothing like it: it's for prototypes. base.css draws the ring.
 *
 * What works:
 *   - a link, a field, a switch, a form's own button, or a button that opens
 *     a popover: the browser does something with each, whatever the page does
 *   - a button its component acts on, such as a segmented control's segment,
 *     which its template marks with data-works
 *   - a button the page listens for, whose component the page marks with
 *     `works`, as <govuk-app-button name="sign-out" works>
 *
 * Any other button goes nowhere until the page says it works: there's no
 * asking whether anything is listening for it.
 *
 * A tap goes nowhere if nothing happens after it: the page doesn't leave or
 * change, and no menu or dialog opens. So this waits a moment after each tap
 * and looks, which catches a button marked as working that doesn't, and one
 * the page listens for without saying so.
 */

/** What can be tapped. A link to "#" is a placeholder, so goes nowhere. */
const tappable = [
  'a[href]:not([href="#"])',
  'button:enabled',
  'label:has(input:enabled, select:enabled, textarea:enabled)',
  'input:enabled:not([type="hidden"], label *)',
  'select:enabled:not(label *)',
  'textarea:enabled:not(label *)',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const root = 'govuk-app[highlight-actions]'
const attribute = 'data-govuk-app-highlight'

/** How long a tap has to do something, in milliseconds. */
const wait = 300

let changed = -Infinity
let pressed = -Infinity
let watching = false

function change() {
  changed = performance.now()
}

/**
 * Notes when the page last changed, from the first press in a root on, so a
 * page that doesn't ask for this isn't watched. A popover or a field's text
 * changes nothing in the DOM, so their events count as well.
 */
function watch() {
  if (watching) return
  watching = true
  new MutationObserver(records => {
    if (records.some(record => record.attributeName !== attribute)) change()
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true })
  for (const type of ['input', 'change', 'submit', 'reset', 'toggle', 'pagehide']) {
    addEventListener(type, change, true)
  }
  // The Navigation API says at once that the page is leaving: pagehide waits
  // for the next page to arrive. Following a link to "#" doesn't count.
  globalThis.navigation?.addEventListener('navigate', event => {
    if (!event.hashChange || new URL(event.destination.url).hash !== '') change()
  })
}

/** Whether the browser does something when `element` is tapped, whatever the page does. */
function native(element) {
  if (element.localName === 'button') {
    return (element.type !== 'button' && element.form !== null) || element.hasAttribute('popovertarget') || element.hasAttribute('commandfor')
  }
  return element.localName !== 'summary' && !element.hasAttribute('tabindex')
}

/** The component that drew `element`: the nearest govuk-app-NAME around it. */
function component(element) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (parent.localName.startsWith('govuk-app-')) return parent
  }
  return null
}

function works(element) {
  return native(element) || element.hasAttribute('data-works') || Boolean(component(element)?.hasAttribute('works'))
}

function highlight(app) {
  for (const element of app.querySelectorAll(`[${attribute}]`)) element.removeAttribute(attribute)
  // Draws the page without the rings, so any still fading start again.
  app.offsetWidth
  for (const element of app.querySelectorAll(tappable)) {
    if (!works(element) || element.closest('[inert]') || !element.checkVisibility({ visibilityProperty: true })) continue
    element.setAttribute(attribute, '')
  }
}

for (const type of ['pointerdown', 'keydown']) {
  document.addEventListener(type, event => {
    if (!event.target.closest?.(root)) return
    watch()
    pressed = event.timeStamp
  }, true)
}

document.addEventListener('click', event => {
  const app = event.target.closest?.(root)
  if (!app || !event.isTrusted) return
  const action = event.target.closest(tappable) ?? event.target.closest('label')
  if (action && native(action)) return
  watch()
  // From the press, so a menu that closes as the tap begins counts. A click
  // with no press before it, from assistive technology, from now.
  const since = event.timeStamp - pressed < 2000 ? pressed : event.timeStamp
  setTimeout(() => {
    if (changed < since) highlight(app)
  }, wait)
})

document.addEventListener('animationend', event => {
  if (event.animationName === 'govuk-app-highlight') event.target.removeAttribute(attribute)
})
