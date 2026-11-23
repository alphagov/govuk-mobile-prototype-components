import { defineComponent, materialSymbols } from '../../foundation/component.js'

/**
 * Sorts the answer's sources from the rest of what was written between its
 * tags, so a prototype can write them in any order.
 */
export function prepareAnswer(data) {
  const body = []
  const sources = []
  for (const node of data.content) {
    if (node.localName === 'govuk-app-chat-source') sources.push(node)
    else body.push(node)
  }
  return { ...data, body, sources }
}

// Both elements share one stylesheet.
const styles = new URL('./chat-answer.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'chat-answer',
    template: new URL('./chat-answer.html', import.meta.url),
    styles,
    attributes: ['note', 'sources-open'],
    prepare: prepareAnswer,
    fonts: [materialSymbols],
  }),
  defineComponent({
    name: 'chat-source',
    template: new URL('./chat-source.html', import.meta.url),
    styles,
    attributes: ['href'],
  }),
])
