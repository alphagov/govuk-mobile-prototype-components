import { defineComponent, materialSymbols } from '../../foundation/component.js'

/** A value, an icon, or, with neither, its own content. */
export function prepareColumn(data) {
  const kind = data.value !== undefined ? 'value' : data.icon !== undefined ? 'icon' : 'content'
  return {
    ...data,
    kind,
    value: kind === 'value' ? data.value : undefined,
    icon: kind === 'icon' ? data.icon : undefined,
    label: kind === 'content' ? undefined : data.label,
    custom: kind === 'content',
  }
}

// Both elements share one stylesheet, and the icons' font.
const styles = new URL('./summary-columns.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'summary-columns',
    template: new URL('./summary-columns.html', import.meta.url),
    styles,
  }),
  defineComponent({
    name: 'summary-column',
    template: new URL('./summary-column.html', import.meta.url),
    styles,
    fonts: [materialSymbols],
    attributes: ['value', 'icon', 'label'],
    prepare: prepareColumn,
  }),
])
