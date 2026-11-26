import { defineComponent } from '../../foundation/component.js'

/**
 * The address's lines, from what was written between its tags: a line for
 * each line of text, or each <br>, with blank lines and indents left out, so
 * it can be written however reads best in the HTML.
 */
function prepare(data) {
  let text = ''
  for (const node of data.content) {
    text += node.nodeName === 'BR' ? '\n' : node.textContent
  }
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
  return { ...data, lines: lines.join('\n') }
}

await defineComponent({
  name: 'address',
  template: new URL('./address.html', import.meta.url),
  styles: new URL('./address.css', import.meta.url),
  attributes: ['name'],
  prepare,
})
