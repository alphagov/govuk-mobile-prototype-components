import { defineComponent } from '../../foundation/component.js'

/** Sorts what was written between its tags: slot="behind" goes behind, the rest is the sheet's. */
export function prepare(data) {
  const behind = []
  const body = []
  for (const node of data.content) {
    if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('slot') === 'behind') behind.push(node)
    else body.push(node)
  }
  return { ...data, behind, body }
}

/**
 * Marks a sheet drawn once every component in it has been: until then, one
 * being presented waits below the screen, so nothing appears on its way up.
 * Gives up waiting after two seconds, in case a page doesn't load a
 * component it uses.
 */
async function whenDrawn(sheet) {
  const giveUp = new Promise(resolve => setTimeout(resolve, 2000))
  const drawn = (async () => {
    for (;;) {
      const waiting = [...sheet.querySelectorAll(':not(:defined)')].filter(element => element.localName.startsWith('govuk-app-'))
      if (waiting.length === 0) return
      await Promise.all(waiting.map(element => customElements.whenDefined(element.localName)))
    }
  })()
  await Promise.race([drawn, giveUp])
  sheet.setAttribute('data-drawn', '')
}

await defineComponent({
  name: 'sheet',
  template: new URL('./sheet.html', import.meta.url),
  styles: new URL('./sheet.css', import.meta.url),
  attributes: ['present', 'label'],
  prepare,
})

for (const sheet of document.querySelectorAll('govuk-app-sheet')) whenDrawn(sheet)
