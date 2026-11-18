import { defineComponent, materialSymbols } from '../../foundation/component.js'

/** A link if it has an href, otherwise a button. Selected is the current tab. */
export function prepareItem(data) {
  return {
    ...data,
    button: data.href === undefined,
    current: data.selected ? 'page' : undefined,
  }
}

/**
 * Pressing a tab that is a button selects it, as a native tab bar does. A tab
 * that is a link goes to its page instead, which marks its own tab selected.
 */
function select(event) {
  const item = event.target.closest?.('govuk-app-tab-bar-item:not([href])')
  const bar = item?.closest('govuk-app-tab-bar')
  if (!bar || item.hasAttribute('selected')) return
  for (const other of bar.querySelectorAll('govuk-app-tab-bar-item[selected]')) other.removeAttribute('selected')
  // Selecting it draws it again, so give focus back to its new button.
  const focused = item.contains(document.activeElement)
  item.setAttribute('selected', '')
  if (focused) item.querySelector('button').focus()
}

document.addEventListener('click', select)

// Both elements share one stylesheet, and the icons' font.
const styles = new URL('./tab-bar.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'tab-bar',
    template: new URL('./tab-bar.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
  }),
  defineComponent({
    name: 'tab-bar-item',
    template: new URL('./tab-bar-item.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
    attributes: ['icon', 'href', 'selected', 'name', 'value'],
    prepare: prepareItem,
  }),
])
