import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'button-stack',
  template: new URL('./button-stack.html', import.meta.url),
  styles: new URL('./button-stack.css', import.meta.url),
})
