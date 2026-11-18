import { defineComponent } from '../../foundation/component.js'

export const variants = ['primary', 'secondary', 'grouped-secondary', 'compact', 'destructive', 'black']

/** Primary unless it names one of the other variants. */
export function prepare(data) {
  return { ...data, variant: variants.includes(data.variant) ? data.variant : 'primary' }
}

await defineComponent({
  name: 'button',
  template: new URL('./button.html', import.meta.url),
  styles: new URL('./button.css', import.meta.url),
  attributes: ['variant', 'disabled', 'name', 'value'],
  prepare,
})
