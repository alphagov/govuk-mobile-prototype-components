import { defineComponent } from '../../foundation/component.js'

/** The DVLA's typeface for registrations, which the app's plates are in. */
const dvlaVrm = {
  family: 'DVLA-VRM',
  stylesheet: new URL('./dvla-vrm.css', import.meta.url),
}

/**
 * Small unless it says large, and the rear plate unless it says front. What screen readers hear: "Number plate:", then
 * the registration spelled out, a character at a time, as the app's
 * speechSpellsOutCharacters does.
 */
export function prepare(data) {
  const registration = data.content.map(node => node.textContent).join('').trim()
  const spelled = [...registration.replace(/\s+/g, '').toUpperCase()].join(' ')
  return {
    ...data,
    size: data.size === 'large' ? 'large' : 'small',
    variant: data.variant === 'front' ? 'front' : 'rear',
    spoken: `Number plate: ${spelled}`,
  }
}

await defineComponent({
  name: 'number-plate',
  template: new URL('./number-plate.html', import.meta.url),
  styles: new URL('./number-plate.css', import.meta.url),
  attributes: ['size', 'variant'],
  prepare,
  fonts: [dvlaVrm],
})
