import { defineComponent } from '../../foundation/component.js'

/** The placeholder is its name for screen readers, unless it has a label. */
export function prepare(data) {
  const placeholder = typeof data.placeholder === 'string' ? data.placeholder : 'Search'
  return {
    ...data,
    name: typeof data.name === 'string' && data.name !== '' ? data.name : 'q',
    placeholder,
    label: typeof data.label === 'string' && data.label !== '' ? data.label : placeholder,
  }
}

/**
 * Tapping the field starts a search: Cancel appears beside it, and stays
 * until it is pressed, as on the app's home screen. Cancel clears the text
 * and puts the field back. Clear empties the field and leaves the user typing.
 *
 * The text changes without the user typing it, so each sends an input event,
 * as the browser's own clear button does, for a page that listens for one.
 */
document.addEventListener('focusin', event => {
  if (!event.target.matches?.('.govuk-app-search-field__input')) return
  event.target.form.toggleAttribute('data-searching', true)
})

// Safari doesn't focus a button that is pressed, so pressing Clear would
// otherwise take focus from the field, which hides Clear before it is pressed.
document.addEventListener('pointerdown', event => {
  if (event.target.closest?.('.govuk-app-search-field__clear')) event.preventDefault()
})

document.addEventListener('click', event => {
  const clear = event.target.closest?.('.govuk-app-search-field__clear')
  const cancel = event.target.closest?.('.govuk-app-search-field__cancel')
  if (!clear && !cancel) return
  const form = (clear ?? cancel).form
  const input = form.querySelector('.govuk-app-search-field__input')
  if (input.value !== '') {
    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
  if (clear) {
    input.focus()
  } else {
    input.blur()
    form.removeAttribute('data-searching')
  }
})

await defineComponent({
  name: 'search-field',
  template: new URL('./search-field.html', import.meta.url),
  styles: new URL('./search-field.css', import.meta.url),
  attributes: ['placeholder', 'label', 'name', 'value', 'action'],
  prepare,
})
