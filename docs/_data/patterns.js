import fs from 'node:fs'
import path from 'node:path'

import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

import loadComponents from './components.js'

// Every pattern's definition, src/patterns/<name>/<name>.json, checked
// against src/schemas/pattern.schema.json, with its HTML, <name>.html beside
// it. A pattern's page is drawn from these, so a folder with both is all it
// takes to get one.
const root = path.resolve(import.meta.dirname, '../..')
const directory = path.join(root, 'src', 'patterns')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))

export default function () {
  const ajv = new Ajv2020({ allErrors: true })
  addFormats(ajv)
  const validate = ajv.compile(readJson(path.join(root, 'src', 'schemas', 'pattern.schema.json')))

  // Each of the library's elements, and the component it belongs to: a part,
  // such as a grouped list's row, belongs to its list.
  const components = loadComponents()
  const owners = new Map(components.flatMap(component => [
    [component.element, component],
    ...Object.keys(component.inputs.parts ?? {}).map(part => [part, component])
  ]))

  const patterns = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const where = `src/patterns/${slug}/${slug}`
    const file = path.join(directory, slug, `${slug}.json`)
    if (!fs.existsSync(file)) continue

    const definition = readJson(file)
    if (!validate(definition)) {
      const errors = validate.errors.map(error => `  ${error.instancePath || '/'} ${error.message}`).join('\n')
      throw new Error(`${where}.json does not match pattern.schema.json:\n${errors}`)
    }

    const htmlFile = path.join(directory, slug, `${slug}.html`)
    if (!fs.existsSync(htmlFile)) throw new Error(`${where}.json has no ${where}.html beside it`)
    const html = fs.readFileSync(htmlFile, 'utf8').trim()

    // A whole screen, as a designer would paste it into their <govuk-app>.
    if (!html.startsWith('<govuk-app-screen') || !html.endsWith('</govuk-app-screen>')) {
      throw new Error(`${where}.html should be one <govuk-app-screen> and what's in it`)
    }

    for (const element of definition.components) {
      if (owners.get(element)?.element !== element) {
        throw new Error(`${where}.json names ${element}, but there's no such component`)
      }
    }

    // Its list of components is what tools choose by, so it must be what the
    // HTML really uses: every one, and no more.
    const used = new Set()
    for (const [, element] of html.matchAll(/<(govuk-app-[a-z0-9-]+)/g)) {
      if (!owners.has(element)) throw new Error(`${where}.html uses ${element}, but there's no such component or part`)
      used.add(owners.get(element).element)
    }
    const describe = elements => [...elements].sort().join(', ')
    if (describe(used) !== describe(definition.components)) {
      throw new Error(`${where}.json says it uses ${describe(definition.components)}, but its HTML uses ${describe(used)}`)
    }

    patterns.push({
      ...definition,
      slug,
      html,
      uses: definition.components.map(element => {
        const { name, slug } = owners.get(element)
        return { element, name, slug }
      })
    })
  }

  return patterns
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((pattern, index) => ({ ...pattern, order: index }))
}
