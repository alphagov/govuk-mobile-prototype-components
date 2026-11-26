import { defineComponent, filled, headingLevel, linkOrButton } from '../../foundation/component.js'

/** h2 unless it names another level; its action a link if it has an href. */
function prepare(data) {
  const level = headingLevel(data.level, [1, 2, 3, 4, 5, 6])
  const action = linkOrButton(data.href, filled(data.action))
  return {
    ...data,
    tag: `h${level}`,
    actionLink: action.link,
    actionButton: action.button,
  }
}

await defineComponent({
  name: 'section-heading',
  template: new URL('./section-heading.html', import.meta.url),
  styles: new URL('./section-heading.css', import.meta.url),
  attributes: ['level', 'action', 'href', 'name', 'value'],
  prepare,
})
