import { defineComponent, materialSymbols } from '../../foundation/component.js'

/**
 * Stacked unless it says inline. With a label for screen readers, such as
 * "Year: 2021", it's read as that, as the app's accessibilityLabel, in place
 * of its label alone.
 */
function prepare(data) {
  return {
    ...data,
    layout: data.layout === 'inline' ? 'inline' : 'stacked',
    role: data.label ? 'img' : undefined,
  }
}

await defineComponent({
  name: 'labelled-icon',
  template: new URL('./labelled-icon.html', import.meta.url),
  styles: new URL('./labelled-icon.css', import.meta.url),
  fonts: [materialSymbols],
  attributes: ['icon', 'layout', 'label'],
  prepare,
})
