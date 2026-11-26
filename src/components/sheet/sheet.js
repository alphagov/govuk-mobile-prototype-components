import { bySlot, defineComponent } from '../../foundation/component.js'

/** Sorts what was written between its tags: slot="behind" goes behind, the rest is the sheet's. */
function prepare(data) {
  const { behind, rest: body } = bySlot(data.content, 'behind')
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

// And any sheet a page adds later, such as a prototype that presents a screen
// when a button is pressed.
new MutationObserver(records => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue
      const sheets = node.localName === 'govuk-app-sheet' ? [node] : node.querySelectorAll('govuk-app-sheet')
      for (const sheet of sheets) if (!sheet.hasAttribute('data-drawn')) whenDrawn(sheet)
    }
  }
}).observe(document, { childList: true, subtree: true })
