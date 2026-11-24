import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'link',
  template: new URL('./link.html', import.meta.url),
  styles: new URL('./link.css', import.meta.url),
  attributes: ['href'],
})
