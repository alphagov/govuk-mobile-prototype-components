import { defineComponent, materialSymbols } from '../../foundation/component.js'
// Its menu is a menu button's.
import '../menu-button/menu-button.js'

/** The app's limit, and how near to it the count is shown (ChatViewModel). */
export const maxCharacters = 300
const warnFrom = maxCharacters - 50

/**
 * The menu's items are what was written between its tags. The field's
 * label is its placeholder, as the app's VoiceOver reads it. A field drawn
 * with a value starts with its count, as it would be once typed.
 */
export function prepare(data) {
  const menu = data.content.filter(node => node.localName === 'govuk-app-menu-button-item')
  const placeholder = data.placeholder || 'Ask a question...'
  const value = typeof data.value === 'string' ? data.value : ''
  const result = count(value.length)
  return {
    ...data,
    menu,
    value,
    placeholder,
    label: data.label || placeholder.replace(/\.+$/, ''),
    name: data.name || 'question',
    method: data.method || 'get',
    message: result?.text,
    messageType: result?.type,
    sendDisabled: value.trim() === '' || value.length > maxCharacters,
  }
}

/**
 * What the app says above the field, near the limit, and whether it's a
 * warning or an error (Chat.xcstrings: remainingCharactersTitle and
 * tooManyCharactersTitle).
 */
export function count(length) {
  const characters = n => `${n} character${n === 1 ? '' : 's'}`
  if (length > maxCharacters) return { type: 'error', text: `${characters(length - maxCharacters)} too many` }
  if (length >= warnFrom) return { type: 'warning', text: `${characters(maxCharacters - length)} remaining` }
  return null
}

/**
 * Keeps a field's count up to date, and its send button off while there's
 * nothing to send or too much, as the app's is.
 */
function update(textarea) {
  const form = textarea.closest('.govuk-app-chat-input')
  if (!form) return
  const message = form.querySelector('.govuk-app-chat-input__message')
  const send = form.querySelector('.govuk-app-chat-input__send')
  const result = count(textarea.value.length)
  message.textContent = result?.text ?? ''
  if (result) message.dataset.type = result.type
  else delete message.dataset.type
  send.disabled = textarea.value.trim() === '' || textarea.value.length > maxCharacters
}

document.addEventListener('input', event => {
  if (event.target.classList?.contains('govuk-app-chat-input__textarea')) update(event.target)
})

await defineComponent({
  name: 'chat-input',
  template: new URL('./chat-input.html', import.meta.url),
  styles: new URL('./chat-input.css', import.meta.url),
  attributes: ['action', 'method', 'name', 'value', 'placeholder', 'label'],
  prepare,
  fonts: [materialSymbols],
})
