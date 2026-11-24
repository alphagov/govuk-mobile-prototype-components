import { defineComponent } from '../../foundation/component.js'

export const variants = ['primary', 'secondary', 'grouped-secondary', 'compact', 'destructive', 'black']

/**
 * Primary unless it names one of the other variants. A plain button unless
 * it says it submits, so a button that happens to be in a form doesn't send
 * it by surprise, as the browser's own would.
 */
export function prepare(data) {
  return {
    ...data,
    variant: variants.includes(data.variant) ? data.variant : 'primary',
    type: data.type === 'submit' ? 'submit' : 'button',
  }
}

await defineComponent({
  name: 'button',
  template: new URL('./button.html', import.meta.url),
  styles: new URL('./button.css', import.meta.url),
  attributes: ['variant', 'type', 'disabled', 'name', 'value'],
  prepare,
})
