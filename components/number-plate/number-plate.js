import { defineComponent } from '../../foundation/component.js'

/**
 * Small unless it says large. What screen readers hear: "Number plate:", then
 * the registration spelled out, a character at a time, as the app's
 * speechSpellsOutCharacters does.
 */
export function prepare(data) {
  const registration = data.content.map(node => node.textContent).join('').trim()
  const spelled = [...registration.replace(/\s+/g, '').toUpperCase()].join(' ')
  return {
    ...data,
    size: data.size === 'large' ? 'large' : 'small',
    spoken: `Number plate: ${spelled}`,
  }
}

await defineComponent({
  name: 'number-plate',
  template: new URL('./number-plate.html', import.meta.url),
  styles: new URL('./number-plate.css', import.meta.url),
  attributes: ['size'],
  prepare,
})
