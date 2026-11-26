import { defineComponent } from '../../foundation/component.js'

const pick = (value, values, otherwise) => (values.includes(value) ? value : otherwise)

/** SwiftUI's defaults: a column, its items centred across it, 8pt apart. */
function prepare(data) {
  return {
    ...data,
    direction: pick(data.direction, ['horizontal', 'vertical'], 'vertical'),
    align: pick(data.align, ['start', 'center', 'end'], 'center'),
    distribute: pick(data.distribute, ['start', 'end', 'between'], 'start'),
    gap: pick(data.gap, ['none', 'extra-small', 'small', 'medium', 'large'], 'small'),
  }
}

await defineComponent({
  name: 'stack',
  template: new URL('./stack.html', import.meta.url),
  styles: new URL('./stack.css', import.meta.url),
  attributes: ['direction', 'align', 'distribute', 'gap'],
  prepare,
})
