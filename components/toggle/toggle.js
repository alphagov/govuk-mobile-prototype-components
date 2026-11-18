import { defineComponent } from '../../foundation/component.js'

await defineComponent({
  name: 'toggle',
  template: new URL('./toggle.html', import.meta.url),
  styles: new URL('./toggle.css', import.meta.url),
  attributes: ['name', 'value', 'checked', 'label'],
})
