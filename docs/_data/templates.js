import fs from 'node:fs'
import path from 'node:path'

import { checkUses, componentsIn, elementMap, loadComponents, loadDefinitions } from '../../scripts/definitions.js'

// Every template's definition, src/templates/<name>/<name>.json, checked
// against src/schemas/template.schema.json, with its pages beside it. A
// template's page is drawn from these, so a folder with a definition is all it
// takes to get one.
const root = path.resolve(import.meta.dirname, '../..')

export default function () {
  const owners = elementMap(loadComponents())

  return loadDefinitions('template', 'templates')
    .map(definition => {
      const where = `src/templates/${definition.slug}`

      // Each page must load the script of each component it uses, or it draws
      // nothing.
      const used = new Map()
      for (const screen of definition.screens) {
        const page = path.join(root, where, screen.file)
        if (!fs.existsSync(page)) throw new Error(`${where}/${definition.slug}.json lists ${screen.file}, but there's no ${where}/${screen.file}`)
        const html = fs.readFileSync(page, 'utf8')
        for (const [element, owner] of componentsIn(html, owners, `${where}/${screen.file}`)) {
          if (!html.includes(`../../components/${owner.slug}/${owner.slug}.js"`)) {
            throw new Error(`${where}/${screen.file} uses ${element}, but doesn't load ../../components/${owner.slug}/${owner.slug}.js`)
          }
          used.set(element, owner)
        }
      }
      checkUses(`${where}/${definition.slug}.json`, definition.components, used, owners, 'its pages use')

      return {
        ...definition,
        uses: definition.components.map(element => {
          const { name, slug } = owners.get(element)
          return { element, name, slug }
        })
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((template, index) => ({ ...template, order: index }))
}
