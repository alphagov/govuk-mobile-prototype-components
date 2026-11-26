import { defineComponent, linkOrButton, materialSymbols, selectOnPress } from '../../foundation/component.js'

/** A link if it has an href, otherwise a button. Selected is the current tab. */
export function prepareItem(data) {
  return {
    ...data,
    ...linkOrButton(data.href),
    current: data.selected ? 'page' : undefined,
  }
}

// Pressing a tab that is a button selects it, as a native tab bar does.
selectOnPress('govuk-app-tab-bar', 'govuk-app-tab-bar-item')

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
