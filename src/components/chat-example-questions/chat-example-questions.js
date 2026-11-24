import { defineComponent } from '../../foundation/component.js'

/** A link if it has an href, otherwise a button. */
export function prepareQuestion(data) {
  return { ...data, button: data.href === undefined }
}

// Both elements share one stylesheet.
const styles = new URL('./chat-example-questions.css', import.meta.url)

await Promise.all([
  defineComponent({
    name: 'chat-example-questions',
    template: new URL('./chat-example-questions.html', import.meta.url),
    styles,
  }),
  defineComponent({
    name: 'chat-example-question',
    template: new URL('./chat-example-question.html', import.meta.url),
    styles,
    attributes: ['href', 'name', 'value'],
    prepare: prepareQuestion,
  }),
])
