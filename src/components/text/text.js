import { defineComponent } from '../../foundation/component.js'

const sizes = ['title-1', 'body', 'callout', 'subheadline', 'footnote', 'caption-1', 'caption-2']

/** Body unless it names another style; the rest only when they're ones it knows. */
function prepare(data) {
  return {
    ...data,
    size: sizes.includes(data.size) ? data.size : 'body',
    colour: data.colour === 'secondary' ? 'secondary' : undefined,
    align: data.align === 'center' ? 'center' : undefined,
  }
}

await defineComponent({
  name: 'text',
  template: new URL('./text.html', import.meta.url),
  styles: new URL('./text.css', import.meta.url),
  attributes: ['size', 'emphasis', 'colour', 'align'],
  prepare,
})
