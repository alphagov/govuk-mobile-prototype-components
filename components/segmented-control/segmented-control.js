import { defineComponent } from '../../foundation/component.js'

/** A link if it has an href, otherwise a button; selected says so. */
export function prepareItem(data) {
  return {
    ...data,
    button: data.href === undefined,
    selectedText: data.selected ? 'true' : 'false',
    current: data.selected && data.href !== undefined ? 'page' : undefined,
  }
}

/**
 * Pressing a segment that is a button selects it, as iOS's does. One that is
 * a link goes to its page instead, which marks its own segment selected.
 */
function select(event) {
  const item = event.target.closest?.('govuk-app-segmented-control-item:not([href])')
  const control = item?.closest('govuk-app-segmented-control')
  if (!control || item.hasAttribute('selected')) return
  for (const other of control.querySelectorAll('govuk-app-segmented-control-item[selected]')) other.removeAttribute('selected')
  // Selecting it draws it again, so give focus back to its new button.
  const focused = item.contains(document.activeElement)
  item.setAttribute('selected', '')
  if (focused) item.querySelector('button').focus()
}

document.addEventListener('click', select)

// Both elements share one stylesheet.
const styles = new URL('./segmented-control.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'segmented-control',
    template: new URL('./segmented-control.html', import.meta.url),
    styles,
    attributes: ['label'],
  }),
  defineComponent({
    name: 'segmented-control-item',
    template: new URL('./segmented-control-item.html', import.meta.url),
    styles,
    attributes: ['href', 'name', 'value', 'selected'],
    prepare: prepareItem,
  }),
])
