import { defineComponent, materialSymbols, materialSymbolsOutlined } from '../../../src/foundation/component.js'

// The Young people example's own components, drawn the same way as the
// library's so any of them could join it later. young-people.css says what
// they are.

const styles = new URL('./young-people.css', import.meta.url)

/** The tiles up to the limit, and the rest, which wait behind See more. */
function prepareGrid(data) {
  const tiles = data.content.filter(node => node.nodeType === Node.ELEMENT_NODE)
  const limit = Number(data.limit)
  const shown = Number.isInteger(limit) && limit > 0 ? limit : tiles.length
  return { ...data, shown: tiles.slice(0, shown), more: tiles.slice(shown) }
}

function prepareTile(data) {
  return { ...data, link: data.href !== undefined, button: data.href === undefined }
}

await Promise.all([
  defineComponent({ name: 'milestone', template: new URL('./milestone.html', import.meta.url), styles, attributes: ['age', 'title'] }),
  defineComponent({ name: 'tile-grid', template: new URL('./tile-grid.html', import.meta.url), styles, attributes: ['limit'], prepare: prepareGrid, fonts: [materialSymbols] }),
  // A tile's icon is a topic's, so from the font the app's topic icons are.
  defineComponent({ name: 'tile', template: new URL('./tile.html', import.meta.url), styles, attributes: ['icon', 'href', 'name', 'value'], prepare: prepareTile, fonts: [materialSymbolsOutlined] }),
])

// See more shows the rest of the tiles, and See less hides them again. It
// changes the drawn grid, not the element's attributes, so the grid isn't
// drawn again and doesn't close.
document.addEventListener('click', event => {
  const toggle = event.target.closest('.govuk-app-tile-grid__toggle')
  if (!toggle) return
  const open = toggle.getAttribute('aria-expanded') !== 'true'
  toggle.setAttribute('aria-expanded', String(open))
  toggle.closest('.govuk-app-tile-grid').querySelector('.govuk-app-tile-grid__more').hidden = !open
})
