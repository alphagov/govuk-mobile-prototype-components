import { defineComponent } from '../../foundation/component.js'

let count = 0

/** Its menu's id, so its button can open it, and its name for screen readers. */
export function prepareButton(data) {
  return { ...data, id: `govuk-app-menu-${++count}`, label: data.label || 'More options' }
}

/** A link if it has an href, otherwise a button. */
export function prepareItem(data) {
  return { ...data, button: data.href === undefined }
}

/**
 * Opens a menu below its button, its right edge under the button's, as iOS
 * does, or its left edge under the button's if there isn't room for it to
 * the left, and above the button if there isn't room below. The menu is in
 * the page's top layer, so it's placed against the window, 8pt in from its
 * edges at least.
 */
document.addEventListener('toggle', event => {
  const menu = event.target
  if (!menu.classList?.contains('govuk-app-menu-button__menu') || event.newState !== 'open') return
  const button = menu.previousElementSibling.getBoundingClientRect()
  const size = menu.getBoundingClientRect()
  const left = button.right - size.width >= 8 ? button.right - size.width : Math.min(button.left, innerWidth - 8 - size.width)
  const below = button.bottom + 8
  const top = below + size.height <= innerHeight - 8 ? below : Math.max(8, button.top - 8 - size.height)
  menu.style.left = `${Math.max(8, left)}px`
  menu.style.top = `${top}px`
}, true)

/** Choosing an item closes the menu, as iOS's does. */
document.addEventListener('click', event => {
  const item = event.target.closest?.('.govuk-app-menu-button-item')
  item?.closest('.govuk-app-menu-button__menu')?.hidePopover()
})

// Both elements share one stylesheet.
const styles = new URL('./menu-button.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'menu-button',
    template: new URL('./menu-button.html', import.meta.url),
    styles,
    attributes: ['label', 'name'],
    prepare: prepareButton,
  }),
  defineComponent({
    name: 'menu-button-item',
    template: new URL('./menu-button-item.html', import.meta.url),
    styles,
    attributes: ['href', 'name', 'value'],
    prepare: prepareItem,
  }),
])
