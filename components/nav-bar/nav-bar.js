import { defineComponent, materialSymbols } from '../../foundation/component.js'

/**
 * The back button is a link if it has a back-href, otherwise a button. The
 * title is the bar's heading, unless it is large, when the large one is. A
 * screen without a title has no heading in the bar.
 */
export function prepareBar(data) {
  const title = typeof data.title === 'string' && data.title !== ''
  return {
    ...data,
    backButton: Boolean(data.back) && data.backHref === undefined,
    inlineTitle: title && !data.largeTitle,
    largeTitle: title && Boolean(data.largeTitle),
    actions: data.content.some(node => node.nodeType === Node.ELEMENT_NODE),
  }
}

/** A link if it has an href, otherwise a button. */
export function prepareItem(data) {
  return {
    ...data,
    button: data.href === undefined,
    hasIcon: data.icon !== undefined,
  }
}

/** The nearest element above `element` that scrolls, or the page. */
function scroller(element) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) return parent
  }
  return document.scrollingElement
}

/**
 * Once content has scrolled under a bar, the bar blurs it, as iOS does, and
 * not before. A large title moves into the bar once it has gone under it.
 * Scroll events don't bubble, so this listens for every one on the page as it
 * passes down to the element that scrolled.
 */
function update() {
  for (const bar of document.querySelectorAll('.govuk-app-nav-bar')) {
    bar.classList.toggle('govuk-app-nav-bar--scrolled', scroller(bar).scrollTop > 0)
    const title = bar.nextElementSibling
    if (!title?.classList.contains('govuk-app-nav-bar__large-title')) continue
    const under = title.getBoundingClientRect().bottom <= bar.getBoundingClientRect().bottom
    bar.classList.toggle('govuk-app-nav-bar--collapsed', under)
  }
}

let frame = 0
document.addEventListener('scroll', () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(update)
}, { capture: true, passive: true })

// Both elements share one stylesheet, and the icons' font.
const styles = new URL('./nav-bar.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'nav-bar',
    template: new URL('./nav-bar.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
    attributes: ['title', 'large-title', 'back', 'back-href'],
    prepare: prepareBar,
  }),
  defineComponent({
    name: 'nav-bar-item',
    template: new URL('./nav-bar-item.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
    attributes: ['icon', 'href', 'name', 'value'],
    prepare: prepareItem,
  }),
])
