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
      prose: fs.existsSync(path.join(root, prose)) ? prose : undefined
    })
  }

  return components.sort((a, b) => a.name.localeCompare(b.name))
}
