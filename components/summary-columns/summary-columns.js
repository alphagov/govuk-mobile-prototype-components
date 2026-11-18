import { defineComponent } from '../../foundation/component.js'

// Both elements share one stylesheet.
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
  }),
])
