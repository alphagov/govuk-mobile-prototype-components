import { defineComponent, materialSymbols } from '../../foundation/component.js'

const types = ['navigation', 'link', 'information', 'detail', 'toggle', 'count', 'selectable']

/** h2 unless it names another level; its action a link if it has an href. */
export function prepareList(data) {
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

/**
 * What a row draws, from its type, as GovKit's GroupedListRowView does: a
 * chevron for navigation, an arrow out for a link, the icon it names for a
 * selectable row, and the detail on the right for the types that have one.
 */
export function prepareRow(data) {
  const type = types.includes(data.type) ? data.type : 'navigation'
  const pressable = !['toggle', 'information'].includes(type)
  const icon = type === 'navigation' ? 'chevron_right'
    : type === 'link' ? 'arrow_outward'
    : type === 'selectable' ? data.icon
    : undefined
  return {
    ...data,
    type,
    link: pressable && data.href !== undefined,
    button: pressable && data.href === undefined,
    toggle: type === 'toggle',
    information: type === 'information',
    icon,
    detail: ['information', 'detail', 'count'].includes(type) ? data.detail : undefined,
    description: ['information', 'link'].includes(type) ? data.description : undefined,
    unread: type === 'count' && Boolean(data.unread),
    destructive: type === 'detail' && Boolean(data.destructive),
  }
}

// Both elements share one stylesheet, and the icons' font.
const styles = new URL('./grouped-list.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'grouped-list',
    template: new URL('./grouped-list.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
    attributes: ['title', 'level', 'action', 'href', 'name', 'value', 'footer'],
    prepare: prepareList,
  }),
  defineComponent({
    name: 'grouped-list-row',
    template: new URL('./grouped-list-row.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
    attributes: ['type', 'detail', 'description', 'icon', 'href', 'name', 'value', 'checked', 'unread', 'destructive'],
    prepare: prepareRow,
  }),
])
