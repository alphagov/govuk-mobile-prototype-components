import fs from 'node:fs'
import path from 'node:path'

import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

import loadComponents from './components.js'

// Every template's definition, src/templates/<name>/<name>.json, checked
// against src/schemas/template.schema.json, with its pages beside it. A
// template's page is drawn from these, so a folder with a definition is all it
// takes to get one.
const root = path.resolve(import.meta.dirname, '../..')
const directory = path.join(root, 'src', 'templates')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))

export default function () {
  const ajv = new Ajv2020({ allErrors: true })
  addFormats(ajv)
  const validate = ajv.compile(readJson(path.join(root, 'src', 'schemas', 'template.schema.json')))

  // Each of the library's elements, and the component it belongs to: a part,
  // such as a grouped list's row, belongs to its list.
  const components = loadComponents()
  const owners = new Map(components.flatMap(component => [
    [component.element, component],
    ...Object.keys(component.inputs.parts ?? {}).map(part => [part, component])
  ]))

  const templates = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const where = `src/templates/${slug}`
    const file = path.join(directory, slug, `${slug}.json`)
    if (!fs.existsSync(file)) continue

    const definition = readJson(file)
    if (!validate(definition)) {
      const errors = validate.errors.map(error => `  ${error.instancePath || '/'} ${error.message}`).join('\n')
      throw new Error(`${where}/${slug}.json does not match template.schema.json:\n${errors}`)
    }

    for (const element of definition.components) {
      if (owners.get(element)?.element !== element) {
        throw new Error(`${where}/${slug}.json names ${element}, but there's no such component`)
      }
    }

    // Its list of components is what tools choose by, so it must be what the
    // pages really use: every one, and no more. Each page must also load the
    // script of each component it uses, or it draws nothing.
    const used = new Set()
    for (const screen of definition.screens) {
      const page = path.join(directory, slug, screen.file)
      if (!fs.existsSync(page)) throw new Error(`${where}/${slug}.json lists ${screen.file}, but there's no ${where}/${screen.file}`)
      const html = fs.readFileSync(page, 'utf8')
      for (const [, element] of html.matchAll(/<(govuk-app-[a-z0-9-]+)/g)) {
        const owner = owners.get(element)
        if (!owner) throw new Error(`${where}/${screen.file} uses ${element}, but there's no such component or part`)
        if (!html.includes(`../../components/${owner.slug}/${owner.slug}.js"`)) {
          throw new Error(`${where}/${screen.file} uses ${element}, but doesn't load ../../components/${owner.slug}/${owner.slug}.js`)
        }
        used.add(owner.element)
      }
    }
    const describe = elements => [...elements].sort().join(', ')
    if (describe(used) !== describe(definition.components)) {
      throw new Error(`${where}/${slug}.json says it uses ${describe(definition.components)}, but its pages use ${describe(used)}`)
    }

    templates.push({
      ...definition,
      slug,
      uses: definition.components.map(element => {
        const { name, slug } = owners.get(element)
        return { element, name, slug }
      })
    })
  }

  return templates
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((template, index) => ({ ...template, order: index }))
}
