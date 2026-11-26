import { defineComponent } from '../../foundation/component.js'

// The app's words for each stage (Chat.xcstrings: loadingQuestionMessage and
// gettingAnswerMessage), each with its own dots, as the app has them.
const texts = {
  sending: 'Sending...',
  generating: 'Generating your answer…',
}

function prepare(data) {
  const stage = data.stage in texts ? data.stage : 'generating'
  return { ...data, stage, text: texts[stage], generating: stage === 'generating' }
}

await defineComponent({
  name: 'chat-loading',
  template: new URL('./chat-loading.html', import.meta.url),
  styles: new URL('./chat-loading.css', import.meta.url),
  attributes: ['stage'],
  prepare,
})
