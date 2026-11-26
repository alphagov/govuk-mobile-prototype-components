import { defineComponent } from '../../foundation/component.js'

const tones = ['caution', 'warning', 'danger']

/** Caution unless it names another tone. */
function prepare(data) {
  return { ...data, tone: tones.includes(data.tone) ? data.tone : 'caution' }
}

await defineComponent({
  name: 'card-header',
  template: new URL('./card-header.html', import.meta.url),
  styles: new URL('./card-header.css', import.meta.url),
  attributes: ['tone', 'tall'],
  prepare,
})
