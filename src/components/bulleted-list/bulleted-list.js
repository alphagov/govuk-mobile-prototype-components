import { defineComponent } from '../../foundation/component.js'

// Both elements share one stylesheet.
const styles = new URL('./bulleted-list.css', import.meta.url)

/** Regular spacing unless it says compact. */
function prepare(data) {
  return { ...data, spacing: data.spacing === 'compact' ? 'compact' : null }
}

await Promise.all([
  defineComponent({
    name: 'bulleted-list',
    template: new URL('./bulleted-list.html', import.meta.url),
    styles,
    attributes: ['spacing'],
    prepare,
  }),
  defineComponent({
    name: 'bulleted-list-item',
    template: new URL('./bulleted-list-item.html', import.meta.url),
    styles,
  }),
])
