import { defineComponent, materialSymbols } from '../../foundation/component.js'
// Its plate is in the number plate's typeface, which that component loads.
import '../number-plate/number-plate.js'

export function prepare(data) {
  return { ...data, button: data.href === undefined }
}

await defineComponent({
  name: 'vehicle-search',
  template: new URL('./vehicle-search.html', import.meta.url),
  styles: new URL('./vehicle-search.css', import.meta.url),
  attributes: ['href', 'name', 'value'],
  fonts: [materialSymbols],
  prepare,
})
