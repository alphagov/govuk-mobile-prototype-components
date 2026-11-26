import { bySlot, defineComponent, filled, headingLevel, linkOrButton, materialSymbols, materialSymbolsOutlined } from '../../foundation/component.js'
// A toggle row draws one.
import '../toggle/toggle.js'

const types = ['navigation', 'link', 'information', 'detail', 'toggle', 'count', 'selectable', 'topic', 'action', 'content']
const backgrounds = ['subtle', 'accent']

/**
 * h2 unless it names another level; its action a link if it has an href.
 * Anything given slot="control" goes above its rows.
 */
function prepareList(data) {
  const { control, rest: rows } = bySlot(data.content, 'control')
  const level = headingLevel(data.level, [1, 2, 3, 4, 5, 6])
  const action = linkOrButton(data.href, filled(data.action))
  return {
    ...data,
    control,
    rows,
    tag: `h${level}`,
    actionLink: action.link,
    actionButton: action.button,
    background: backgrounds.includes(data.background) ? data.background : undefined,
    dividers: data.dividers === 'full' ? 'full' : undefined,
  }
}

/**
 * What a row draws, from its type, as GovKit's GroupedListRowView does: a
 * chevron for navigation, an arrow out for a link, the icon it names for a
 * selectable row, and the detail on the right for the types that have one. A
 * topic is a navigation row with its icon on the left, as the app's
 * TopicListItemView, or a star, the app's for a topic without one. An action
 * row, as the app's Add vehicle, has an outlined plus on the right, or the
 * icon it names. An information or link row may have an image on its left,
 * as GovKit's InformationRowView and LinkRowView do. A content row,
 * proposed, holds whatever was written between its tags.
 */
function prepareRow(data) {
  const type = types.includes(data.type) ? data.type : 'navigation'
  const pressable = !['toggle', 'information', 'content'].includes(type)
  const icon = ['navigation', 'topic'].includes(type) ? 'chevron_right'
    : type === 'link' ? (data.noArrow ? undefined : 'arrow_outward')
    : type === 'selectable' ? data.icon
    : type === 'action' ? data.icon
    : undefined
  return {
    ...data,
    type,
    ...linkOrButton(data.href, pressable),
    toggle: type === 'toggle',
    information: type === 'information',
    contentRow: type === 'content',
    plus: type === 'action' && !data.icon,
    flush: type === 'content' && Boolean(data.flush),
    icon,
    topic: type === 'topic' ? data.icon || 'star' : undefined,
    detail: ['information', 'detail', 'count'].includes(type) ? data.detail : undefined,
    description: ['information', 'link'].includes(type) ? data.description : undefined,
    image: ['information', 'link'].includes(type) ? data.image : undefined,
    unread: type === 'count' && Boolean(data.unread),
    destructive: type === 'detail' && Boolean(data.destructive),
  }
}

// Both elements share one stylesheet, and the icons' fonts: a topic's icon
// is from Material Symbols Outlined.
const styles = new URL('./grouped-list.css', import.meta.url)
const fonts = [materialSymbols, materialSymbolsOutlined]

await Promise.all([
  defineComponent({
    name: 'grouped-list',
    template: new URL('./grouped-list.html', import.meta.url),
    styles,
    fonts,
    attributes: ['title', 'level', 'action', 'href', 'name', 'value', 'footer', 'background', 'dividers'],
    prepare: prepareList,
  }),
  defineComponent({
    name: 'grouped-list-row',
    template: new URL('./grouped-list-row.html', import.meta.url),
    styles,
    fonts,
    attributes: ['type', 'detail', 'description', 'icon', 'image', 'href', 'name', 'value', 'checked', 'unread', 'destructive', 'no-arrow', 'flush'],
    prepare: prepareRow,
  }),
])
