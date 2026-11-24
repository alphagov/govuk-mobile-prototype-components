import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'link-card',
  template: new URL('./link-card.html', import.meta.url),
  styles: new URL('./link-card.css', import.meta.url),
  attributes: ['href', 'description'],
})
