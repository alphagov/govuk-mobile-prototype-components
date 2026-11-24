import { defineComponent, materialSymbols } from '../../foundation/component.js'

/**
 * Sorts out what goes inside it. The box's name for screen readers is its
 * label, or its placeholder, and its value is sent as q unless it has a name.
 */
export function prepare(data) {
  const accessory = data.content.filter(node => node.nodeType === Node.ELEMENT_NODE && node.getAttribute('slot') === 'accessory')
  return {
    ...data,
    accessory,
    name: typeof data.name === 'string' && data.name !== '' ? data.name : 'q',
    spoken: data.label || data.placeholder,
  }
}

await defineComponent({
  name: 'search-box',
  template: new URL('./search-box.html', import.meta.url),
  styles: new URL('./search-box.css', import.meta.url),
  attributes: ['placeholder', 'label', 'name', 'value', 'action'],
  fonts: [materialSymbols],
  prepare,
})
