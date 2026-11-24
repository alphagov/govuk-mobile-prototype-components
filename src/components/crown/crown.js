import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'crown',
  template: new URL('./crown.html', import.meta.url),
  styles: new URL('./crown.css', import.meta.url),
})
