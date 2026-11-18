import { defineComponent } from '../../foundation/component.js'

/** Sorts what was written between its tags: slot="behind" goes behind, the rest is the sheet's. */
export function prepare(data) {
  const behind = []
  const body = []
  for (const node of data.content) {
    if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('slot') === 'behind') behind.push(node)
    else body.push(node)
  }
  return { ...data, behind, body }
}

await defineComponent({
  name: 'sheet',
  template: new URL('./sheet.html', import.meta.url),
  styles: new URL('./sheet.css', import.meta.url),
  attributes: ['present', 'label'],
  prepare,
})
