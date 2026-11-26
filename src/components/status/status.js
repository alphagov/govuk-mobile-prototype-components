import { defineComponent } from '../../foundation/component.js'

const states = ['valid', 'due', 'expired', 'none']

/**
 * Valid unless it names another state. A due status's ring is filled by its
 * progress, from 0 to 1, given to the stylesheet as a custom property.
 */
function prepare(data) {
  const state = states.includes(data.state) ? data.state : 'valid'
  const progress = Math.min(1, Math.max(0, Number(data.progress)))
  return {
    ...data,
    state,
    icon: state !== 'none',
    progressStyle: state === 'due' && Number.isFinite(progress) ? `--govuk-app-status-progress: ${progress}` : undefined,
  }
}

await defineComponent({
  name: 'status',
  template: new URL('./status.html', import.meta.url),
  styles: new URL('./status.css', import.meta.url),
  attributes: ['state', 'progress', 'label', 'detail', 'caption'],
  prepare,
})
