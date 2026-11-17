import fs from 'node:fs'
import path from 'node:path'

import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

// Every component's definition, components/<name>/<name>.json, checked against
// component.schema.json. A component's page is drawn from this, so a folder
// with a definition is all it takes to get one.
const root = path.resolve(import.meta.dirname, '../..')
const directory = path.join(root, 'components')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))

// What the site calls each kind of component (its origin.kind), one and many,
// in the order they're listed.
const kinds = {
  govuk: { one: 'GOV.UK app component', many: 'GOV.UK app components' },
  native: { one: 'Native component', many: 'Native components' }
}
const kindOrder = Object.keys(kinds)

export default function () {
  const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true })
  addFormats(ajv)
  const validate = ajv.compile(readJson(path.join(root, 'component.schema.json')))

  const components = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const file = path.join(directory, slug, `${slug}.json`)
    if (!fs.existsSync(file)) continue

    const definition = readJson(file)
    if (!validate(definition)) {
      const errors = validate.errors.map(error => `  ${error.instancePath || '/'} ${error.message}`).join('\n')
      throw new Error(`components/${slug}/${slug}.json does not match component.schema.json:\n${errors}`)
    }

    // Prose about the component that the definition can't say well, if any.
    const prose = path.join('components', slug, `${slug}.md`)
    components.push({
      ...definition,
      slug,
      kind: kinds[definition.origin.kind],
      prose: fs.existsSync(path.join(root, prose)) ? prose : undefined
    })
  }

  // By kind, then by name. Each one's place is its order in the sidebar, which
  // groups them by kind.
  return components
    .sort((a, b) =>
      kindOrder.indexOf(a.origin.kind) - kindOrder.indexOf(b.origin.kind) ||
      a.name.localeCompare(b.name))
    .map((component, index) => ({ ...component, order: index }))
}
