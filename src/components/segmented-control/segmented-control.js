import { defineComponent, linkOrButton, selectOnPress } from '../../foundation/component.js'

/** A link if it has an href, otherwise a button; selected says so. */
export function prepareItem(data) {
  const { link, button } = linkOrButton(data.href)
  return {
    ...data,
    link,
    button,
    selectedText: data.selected ? 'true' : 'false',
    current: data.selected && link ? 'page' : undefined,
  }
}

// Pressing a segment that is a button selects it, as iOS's does.
selectOnPress('govuk-app-segmented-control', 'govuk-app-segmented-control-item')

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
