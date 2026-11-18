import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'count',
  template: new URL('./count.html', import.meta.url),
  styles: new URL('./count.css', import.meta.url),
  attributes: ['value'],
})
