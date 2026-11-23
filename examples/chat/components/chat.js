import { defineComponent, materialSymbols } from '../../../foundation/component.js'

// The Chat example's own components, drawn the same way as the library's so
// any of them could join it later. chat.css says where each comes from.

const styles = new URL('./chat.css', import.meta.url)
const fonts = [materialSymbols]

/** The answer's content shows once it's no longer pending. */
function prepareAnswer(data) {
  return { ...data, ready: !data.pending }
}

/** What a screen reader says for a saved detail's two buttons. */
function prepareDetail(data) {
  return {
    ...data,
    aboutLabel: `Where the app got this: ${data.label}`,
    useLabel: `Use ${data.label}`,
  }
}

await Promise.all([
  defineComponent({ name: 'chat-conversation', template: new URL('./conversation.html', import.meta.url), styles }),
  defineComponent({ name: 'chat-question', template: new URL('./question.html', import.meta.url), styles }),
  defineComponent({ name: 'chat-answer', template: new URL('./answer.html', import.meta.url), styles, attributes: ['pending'], prepare: prepareAnswer }),
  defineComponent({ name: 'chat-suggestions', template: new URL('./suggestions.html', import.meta.url), styles }),
  defineComponent({ name: 'chat-suggestion', template: new URL('./suggestion.html', import.meta.url), styles, attributes: ['href'] }),
  defineComponent({ name: 'chat-input', template: new URL('./input.html', import.meta.url), styles, attributes: ['placeholder', 'value'], fonts }),
  defineComponent({ name: 'chat-saved-details', template: new URL('./saved-details.html', import.meta.url), styles, attributes: ['name', 'action'] }),
  defineComponent({ name: 'chat-saved-detail', template: new URL('./saved-detail.html', import.meta.url), styles, attributes: ['label', 'source', 'name', 'checked'], prepare: prepareDetail, fonts }),
  defineComponent({ name: 'chat-remembered', template: new URL('./remembered.html', import.meta.url), styles, attributes: ['href'] }),
])

// Messages are added to what the conversation has drawn. Wait until every
// component on the page has been drawn: one drawn later, such as the screen
// the conversation is in, moves it, which draws it again from what was
// written in the page, and anything added before then would be lost. The
// root, <govuk-app>, is never defined, so isn't waited for.
await Promise.all([...document.querySelectorAll(':not(:defined)')]
  .filter(node => node.localName.startsWith('govuk-app-'))
  .map(node => customElements.whenDefined(node.localName)))

// A saved detail's info button shows where the app got it, and hides it
// again. It changes the drawn row, not the element's attributes, so the row
// isn't drawn again and the checkbox keeps its state.
document.addEventListener('click', event => {
  const about = event.target.closest('.govuk-app-chat-saved-detail__about')
  if (!about) return
  const open = about.getAttribute('aria-expanded') !== 'true'
  about.setAttribute('aria-expanded', String(open))
  about.closest('.govuk-app-chat-saved-detail').querySelector('.govuk-app-chat-saved-detail__source').hidden = !open
})

/** How long Chat takes to answer, in milliseconds, so it feels like it's thinking. */
const thinking = 1500

const wait = time => new Promise(resolve => setTimeout(resolve, time))

function conversation() {
  return document.querySelector('.govuk-app-chat-conversation')
}

/** Scrolls what the conversation is in to its end, so the newest message is in view. */
function scrollToEnd() {
  for (let parent = conversation()?.parentElement; parent; parent = parent.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) {
      parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' })
      return
    }
  }
}

/** An element with the given attributes and children. */
export function element(tag, attributes = {}, ...children) {
  const node = document.createElement(tag)
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value === true ? '' : value)
  node.append(...children)
  return node
}

/** An answer of one or more paragraphs. */
export function answer(...paragraphs) {
  return element('govuk-app-chat-answer', {}, ...paragraphs.map(text => element('govuk-app-text', {}, text)))
}

/** Adds the user's question to the end of the conversation. */
export function ask(text) {
  conversation().append(element('govuk-app-chat-question', {}, text))
  scrollToEnd()
}

/**
 * Chat's reply: the pending dots, for a moment, then each part in turn. A
 * part is a string, for an answer of one paragraph; a <template>, for what
 * the page wrote in it; or an element. With `instantly`, there's no wait.
 */
export async function reply(parts, { instantly = false } = {}) {
  const nodes = parts.flatMap(part =>
    typeof part === 'string' ? [answer(part)]
      : part instanceof HTMLTemplateElement ? [...part.content.cloneNode(true).children]
        : [part])
  if (instantly) {
    conversation().append(...nodes)
  } else {
    const pending = element('govuk-app-chat-answer', { pending: true })
    conversation().append(pending)
    scrollToEnd()
    await wait(thinking)
    pending.replaceWith(...nodes)
  }
  // After the new messages have been drawn.
  requestAnimationFrame(scrollToEnd)
}

/**
 * What happens when the user sends a question. By default, Chat says it
 * can't answer: the example only answers what it was written for. A page
 * gives its own with onQuestion.
 */
let answerQuestion = async question => {
  if (!question) return
  ask(question)
  await reply(['This is a prototype, so I can only answer the questions it was written for.'])
}

export function onQuestion(callback) {
  answerQuestion = callback
}

document.addEventListener('submit', event => {
  const form = event.target.closest('.govuk-app-chat-input')
  if (!form) return
  event.preventDefault()
  const field = form.elements.question
  const question = field.value.trim()
  field.value = ''
  answerQuestion(question)
})
