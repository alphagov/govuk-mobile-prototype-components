import { defineComponent, filled, idFor } from '../../foundation/component.js'

const types = ['text', 'email', 'tel', 'url', 'password', 'postcode']

/**
 * Screen readers hear the hint and the error after the field's label, so
 * each needs an id, unique on the page, for the field to point at.
 *
 * A postcode is text in capitals, as the app's postcode field has it, with
 * the browser offering the user's own.
 */
function prepare(data, element) {
  const id = idFor(element, 'govuk-app-text-field')
  const type = types.includes(data.type) ? data.type : 'text'
  const hint = filled(data.hint) ? data.hint : null
  const error = filled(data.error) ? data.error : null
  const postcode = type === 'postcode'
  return {
    ...data,
    type: postcode ? 'text' : type,
    autocomplete: data.autocomplete ?? (postcode ? 'postal-code' : null),
    autocapitalize: postcode ? 'characters' : null,
    spellcheck: postcode || type !== 'text' ? 'false' : null,
    hint,
    error,
    hintId: hint && `${id}-hint`,
    errorId: error && `${id}-error`,
    describedBy: [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || null,
    invalid: error ? 'true' : null,
  }
}

await defineComponent({
  name: 'text-field',
  template: new URL('./text-field.html', import.meta.url),
  styles: new URL('./text-field.css', import.meta.url),
  attributes: ['label', 'hint', 'error', 'type', 'name', 'value', 'placeholder', 'autocomplete'],
  prepare,
})
