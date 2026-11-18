import { defineComponent } from '../../foundation/component.js'

/** Sorts out what goes beside its title, and makes the title h2 unless level says. */
export function prepare(data) {
  const accessory = []
  const body = []
  for (const node of data.content) {
    if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('slot') === 'accessory') accessory.push(node)
    else body.push(node)
  }
  const level = ['3', '4'].includes(data.level) ? data.level : '2'
  return { ...data, accessory, body, tag: `h${level}` }
}

await defineComponent({
  name: 'section',
  template: new URL('./section.html', import.meta.url),
  styles: new URL('./section.css', import.meta.url),
  attributes: ['title', 'description', 'level'],
  prepare,
})
