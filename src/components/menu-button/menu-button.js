import { defineComponent, idFor, linkOrButton, materialSymbols } from '../../foundation/component.js'

const variants = ['card', 'chat']

/** Its menu's id, so its button can open it, and its name for screen readers. */
export function prepareButton(data, element) {
  return {
    ...data,
    id: idFor(element, 'govuk-app-menu'),
    label: data.label || 'More options',
    variant: variants.includes(data.variant) ? data.variant : 'card',
  }
}

/** A link if it has an href, otherwise a button. */
export function prepareItem(data) {
  return { ...data, ...linkOrButton(data.href) }
}

/* Below its button, its right edge under the button's, as iOS's menu, or
   where it fits, 8pt in from the app's screen, or the window's if it's too
   small to hold it: the menu is in the browser's top layer, so nothing in
   the screen clips it. It's placed in screen pixels, then turned into its
   own, which differ when what it's in is zoomed or scaled, as the examples'
   phone is. */
document.addEventListener('toggle', event => {
  const menu = event.target
  if (!menu.classList?.contains('govuk-app-menu-button__menu') || event.newState !== 'open') return
  const button = menu.previousElementSibling.getBoundingClientRect()

  menu.style.left = '0px'
  menu.style.top = '0px'
  const origin = menu.getBoundingClientRect()
  const scale = origin.width / menu.offsetWidth || 1
  const gap = 8 * scale

  const app = menu.closest('govuk-app')?.getBoundingClientRect()
  const fits = app && app.width >= origin.width + 2 * gap && app.height >= origin.height + button.height + 3 * gap
  const bounds = fits ? app : { left: 0, top: 0, right: innerWidth, bottom: innerHeight }

  const right = button.right - origin.width
  const left = right >= bounds.left + gap ? right : Math.min(button.left, bounds.right - gap - origin.width)
  const below = button.bottom + gap
  const top = below + origin.height <= bounds.bottom - gap ? below : Math.max(bounds.top + gap, button.top - gap - origin.height)

  menu.style.left = `${(Math.max(bounds.left + gap, left) - origin.left) / scale}px`
  menu.style.top = `${(top - origin.top) / scale}px`
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
    attributes: ['label', 'name', 'variant'],
    prepare: prepareButton,
  }),
  defineComponent({
    name: 'menu-button-item',
    template: new URL('./menu-button-item.html', import.meta.url),
    styles,
    attributes: ['href', 'name', 'value', 'destructive', 'icon'],
    prepare: prepareItem,
    fonts: [materialSymbols],
  }),
])
