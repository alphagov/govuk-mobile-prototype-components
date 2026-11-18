import { defineComponent } from '../../foundation/component.js'

/** It leaves room for a search field only if one was written between its tags. */
export function prepare(data) {
  return {
    ...data,
    search: data.content.some(node => node.nodeType === Node.ELEMENT_NODE),
  }
}

await defineComponent({
  name: 'home-header',
  template: new URL('./home-header.html', import.meta.url),
  styles: new URL('./home-header.css', import.meta.url),
  prepare,
})
