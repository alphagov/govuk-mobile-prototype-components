import { defineComponent } from '../../foundation/component.js'

/** h2 unless it names another level; its action a link if it has an href. */
export function prepare(data) {
  const number = Number(data.level)
  const level = Number.isInteger(number) && number >= 1 && number <= 6 ? number : 2
  const action = typeof data.action === 'string' && data.action !== ''
  return {
    ...data,
    tag: `h${level}`,
    actionLink: action && data.href !== undefined,
    actionButton: action && data.href === undefined,
  }
}

await defineComponent({
  name: 'section-heading',
  template: new URL('./section-heading.html', import.meta.url),
  styles: new URL('./section-heading.css', import.meta.url),
  attributes: ['level', 'action', 'href', 'name', 'value'],
  prepare,
})
