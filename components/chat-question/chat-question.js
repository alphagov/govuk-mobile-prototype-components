import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'chat-question',
  template: new URL('./chat-question.html', import.meta.url),
  styles: new URL('./chat-question.css', import.meta.url),
})
