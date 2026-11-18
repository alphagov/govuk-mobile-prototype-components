import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'strong',
  template: new URL('./strong.html', import.meta.url),
  styles: new URL('./strong.css', import.meta.url),
})
