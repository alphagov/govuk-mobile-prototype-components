import { bySlot, defineComponent, headingLevel } from '../../foundation/component.js'

/** Sorts out what goes beside its title, and makes the title h2 unless level says. */
export function prepare(data) {
  const { accessory, rest: body } = bySlot(data.content, 'accessory')
  const level = headingLevel(data.level, [2, 3, 4])
  return { ...data, accessory, body, tag: `h${level}` }
}

await defineComponent({
  name: 'section',
  template: new URL('./section.html', import.meta.url),
  styles: new URL('./section.css', import.meta.url),
  attributes: ['title', 'description', 'level'],
  prepare,
})
