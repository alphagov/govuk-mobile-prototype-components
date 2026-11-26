import fs from 'node:fs'
import path from 'node:path'

import { checkUses, componentsIn, elementMap, loadComponents, loadDefinitions } from '../../scripts/definitions.js'

// Every pattern's definition, src/patterns/<name>/<name>.json, checked
// against src/schemas/pattern.schema.json, with its HTML, <name>.html beside
// it. A pattern's page is drawn from these, so a folder with both is all it
// takes to get one.
const root = path.resolve(import.meta.dirname, '../..')

export default function () {
  const owners = elementMap(loadComponents())

  const patterns = loadDefinitions('pattern', 'patterns').map(definition => {
    const where = `src/patterns/${definition.slug}/${definition.slug}`
    const htmlFile = path.join(root, `${where}.html`)
    if (!fs.existsSync(htmlFile)) throw new Error(`${where}.json has no ${where}.html beside it`)
    const html = fs.readFileSync(htmlFile, 'utf8').trim()

    // A whole screen, as a designer would paste it into their <govuk-app>.
    if (!html.startsWith('<govuk-app-screen') || !html.endsWith('</govuk-app-screen>')) {
      throw new Error(`${where}.html should be one <govuk-app-screen> and what's in it`)
    }

    checkUses(`${where}.json`, definition.components, componentsIn(html, owners, `${where}.html`), owners)

    return {
      ...definition,
      html,
      uses: definition.components.map(element => {
        const { name, slug } = owners.get(element)
        return { element, name, slug }
      })
    }
  })

  checkAvoid(patterns)

  return patterns
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((pattern, index) => ({ ...pattern, order: index }))
}

/**
 * What a pattern says to use instead, where that's another pattern, is its
 * name exactly, so its page and its catalogue card link to that pattern's.
 * Words that start with a pattern's name and go on would link in neither, so
 * fail the build. Anything else is words, such as "Do it straight away".
 */
function checkAvoid(patterns) {
  const named = new Map(patterns.map(pattern => [pattern.name, pattern]))
  for (const pattern of patterns) {
    for (const avoid of pattern.avoid) {
      const other = named.get(avoid.instead)
      if (other) {
        avoid.slug = other.slug
        continue
      }
      const near = patterns.find(({ name }) => avoid.instead.toLowerCase().startsWith(name.toLowerCase()))
      if (near) {
        throw new Error(`src/patterns/${pattern.slug}/${pattern.slug}.json says to use "${avoid.instead}" instead. To send people to the ${near.name} pattern, name it exactly, "${near.name}", and say the rest in "when".`)
      }
    }
  }
}
