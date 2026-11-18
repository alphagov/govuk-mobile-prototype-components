import { defineComponent } from '../../foundation/component.js'

const sizes = ['large-title', 'title-1', 'title-2', 'title-3', 'body']

/**
 * The size a heading takes when it doesn't name one, by its level: a
 * screen's title in Large Title, as most of the app's are, a section in
 * Title 3, as GovKit's section headings are, and anything smaller in Body.
 */
const sizeForLevel = level => (level === 1 ? 'large-title' : level === 2 ? 'title-3' : 'body')

/** Its tag from its level, h2 if it has none or one out of range. */
export function prepare(data) {
  const number = Number(data.level)
  const level = Number.isInteger(number) && number >= 1 && number <= 6 ? number : 2
  return {
    ...data,
    tag: `h${level}`,
    size: sizes.includes(data.size) ? data.size : sizeForLevel(level),
    align: data.align === 'center' ? 'center' : undefined,
  }
}

await defineComponent({
  name: 'heading',
  template: new URL('./heading.html', import.meta.url),
  styles: new URL('./heading.css', import.meta.url),
  attributes: ['level', 'size', 'align'],
  prepare,
})
