import { defineComponent, materialSymbols } from '../../../src/foundation/component.js'
// The library's chat components, which the conversation adds to.
import '../../../src/components/text/text.js'
import '../../../src/components/chat-question/chat-question.js'
import '../../../src/components/chat-answer/chat-answer.js'
import '../../../src/components/chat-loading/chat-loading.js'
import '../../../src/components/chat-input/chat-input.js'

// The proposals' own components, drawn the same way as the library's so
// either could join it later. chat.css says what they are.

const styles = new URL('./chat.css', import.meta.url)
const fonts = [materialSymbols]

/** What a screen reader says for a saved detail's two buttons. */
function prepareDetail(data) {
  return {
    ...data,
    aboutLabel: `Where the app got this: ${data.label}`,
    useLabel: `Use ${data.label}`,
  }
}

await Promise.all([
  defineComponent({ name: 'chat-saved-details', template: new URL('./saved-details.html', import.meta.url), styles, attributes: ['name', 'action'] }),
  defineComponent({ name: 'chat-saved-detail', template: new URL('./saved-detail.html', import.meta.url), styles, attributes: ['label', 'source', 'name', 'checked'], prepare: prepareDetail, fonts }),
  defineComponent({ name: 'chat-remembered', template: new URL('./remembered.html', import.meta.url), styles, attributes: ['href'] }),
])

// Messages are added after the conversation's last. Wait until every
// component on the page has been drawn: one drawn later, such as the screen
// the conversation is in, draws what's in it again from what was written in
// the page, and anything added before then would be lost. The root,
// <govuk-app>, is never defined, so isn't waited for.
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

/** How long Chat takes to send a question, then to answer it, in milliseconds. */
const sending = 600
const generating = 1500

const wait = time => new Promise(resolve => setTimeout(resolve, time))

/** The last message in the conversation, which new ones go after. */
function last() {
  return [...document.querySelectorAll('govuk-app-chat-question, govuk-app-chat-answer, govuk-app-chat-loading, govuk-app-chat-saved-details, govuk-app-chat-remembered')].at(-1)
}

/** Scrolls what the conversation is in to its end, so the newest message is in view. */
function scrollToEnd() {
  for (let parent = last()?.parentElement; parent; parent = parent.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) {
      parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' })
      return
    }
  }
}

/** Adds nodes to the end of the conversation. */
function add(...nodes) {
  last().after(...nodes)
  scrollToEnd()
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
  add(element('govuk-app-chat-question', {}, text))
}

/**
 * Chat's reply, after it has shown it's sending, then generating: each part
 * in turn. A part is a string, for an answer of one paragraph; a
 * <template>, for what the page wrote in it; or an element. With
 * `instantly`, there's no wait.
 */
export async function reply(parts, { instantly = false } = {}) {
  const nodes = parts.flatMap(part =>
    typeof part === 'string' ? [answer(part)]
      : part instanceof HTMLTemplateElement ? [...part.content.cloneNode(true).children]
        : [part])
  if (instantly) {
    add(...nodes)
  } else {
    const loading = element('govuk-app-chat-loading', { stage: 'sending' })
    add(loading)
    await wait(sending)
    loading.setAttribute('stage', 'generating')
    await wait(generating)
    loading.replaceWith(...nodes)
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
  ask(question)
  await reply(['This is a prototype, so I can only answer the questions it was written for.'])
}

export function onQuestion(callback) {
  answerQuestion = callback
}

// The chat input sends its question to another page. Here, Chat answers on
// this one instead.
document.addEventListener('submit', event => {
  const form = event.target.closest('.govuk-app-chat-input')
  if (!form) return
  event.preventDefault()
  const field = form.querySelector('textarea')
  const question = field.value.trim()
  if (!question) return
  field.value = ''
  // So the input empties its count and turns its send button off.
  field.dispatchEvent(new Event('input', { bubbles: true }))
  answerQuestion(question)
})
