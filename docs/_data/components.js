import fs from 'node:fs'
import path from 'node:path'

import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

// Every component's definition, src/components/<name>/<name>.json, checked
// against src/schemas/component.schema.json. A component's page is drawn from
// this, so a folder with a definition is all it takes to get one.
const root = path.resolve(import.meta.dirname, '../..')
const directory = path.join(root, 'src', 'components')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))

// What the site calls each kind of component (its origin.kind), one and many,
// in the order they're listed.
const kinds = {
  govuk: { one: 'GOV.UK app component', many: 'GOV.UK app components' },
  native: { one: 'Native component', many: 'Native components' }
}

// The groups they're listed in, in this order: the app's components by kind,
// then the ones proposed for it, of either kind, apart from them.
const proposed = 'Proposed components'
const groupOrder = [...Object.values(kinds).map(kind => kind.many), proposed]

export default function () {
  const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true })
  addFormats(ajv)
  const validate = ajv.compile(readJson(path.join(root, 'src', 'schemas', 'component.schema.json')))

  const components = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const file = path.join(directory, slug, `${slug}.json`)
    if (!fs.existsSync(file)) continue

    const definition = readJson(file)
    if (!validate(definition)) {
      const errors = validate.errors.map(error => `  ${error.instancePath || '/'} ${error.message}`).join('\n')
      throw new Error(`src/components/${slug}/${slug}.json does not match component.schema.json:\n${errors}`)
    }

    checkAgainstScript(slug, definition)

    // Prose about the component that the definition can't say well, if any.
    const prose = path.join('src', 'components', slug, `${slug}.md`)
    components.push({
      ...definition,
      slug,
      kind: kinds[definition.origin.kind],
      group: definition.proposed ? proposed : kinds[definition.origin.kind].many,
      prose: fs.existsSync(path.join(root, prose)) ? prose : undefined
    })
  }

  checkContains(components)
  checkAvoid(components)

  // By group, then by name. Each one's place is its order in the sidebar,
  // which groups them.
  return components
    .sort((a, b) =>
      groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
      a.name.localeCompare(b.name))
    .map((component, index) => ({ ...component, order: index }))
}

/**
 * The elements a component's script defines, each with the attributes it
 * reads: what defineComponent is given, in src/components/<name>/<name>.js.
 */
function definedByScript(slug) {
  const source = fs.readFileSync(path.join(directory, slug, `${slug}.js`), 'utf8')
  return new Map(source.split('defineComponent(').slice(1).map(call => {
    const options = call.slice(0, call.indexOf('})'))
    const name = options.match(/name:\s*'([a-z-]+)'/)[1]
    const list = options.match(/attributes:\s*\[([^\]]*)\]/)
    return [`govuk-app-${name}`, list ? [...list[1].matchAll(/'([a-z-]+)'/g)].map(match => match[1]) : []]
  }))
}

/**
 * A definition says what its component and its parts read, so tools can build
 * pages from it, such as a prototype's schema. Fail the build if it says
 * anything different from what the script does.
 */
function checkAgainstScript(slug, definition) {
  const defined = new Map([
    [definition.element, Object.keys(definition.inputs.attributes)],
    ...Object.entries(definition.inputs.parts ?? {}).map(([element, part]) => [element, Object.keys(part.attributes)]),
  ])
  const scripted = definedByScript(slug)
  const describe = elements => [...elements].sort().join(', ') || 'nothing'
  if (describe(defined.keys()) !== describe(scripted.keys())) {
    throw new Error(`src/components/${slug}/${slug}.json defines ${describe(defined.keys())}, but its script defines ${describe(scripted.keys())}`)
  }
  for (const [element, attributes] of defined) {
    if (describe(attributes) !== describe(scripted.get(element))) {
      throw new Error(`src/components/${slug}/${slug}.json says ${element} reads ${describe(attributes)}, but its script reads ${describe(scripted.get(element))}`)
    }
  }
}

/**
 * Every element a definition says may go inside its component is one of the
 * library's components, or a part of one, such as the menu button's items,
 * which Chat's field has too.
 */
function checkContains(components) {
  const library = new Set(components.flatMap(component => [component.element, ...Object.keys(component.inputs.parts ?? {})]))
  for (const component of components) {
    const everything = [component.inputs.contains, ...Object.values(component.inputs.parts ?? {}).map(part => part.contains)]
    for (const contains of everything) {
      const named = [contains.inline, contains.elements, ...Object.values(contains.slots ?? {})]
        .filter(Array.isArray).flat()
      for (const element of named) {
        if (!library.has(element)) {
          throw new Error(`src/components/${component.slug}/${component.slug}.json says ${element} may go inside it, but there's no such component or part`)
        }
      }
    }
  }
}

/**
 * What a definition says to use instead of its component, where that's an
 * element of the library, such as govuk-app-button variant="destructive", is
 * one, with attributes it reads and values it takes, so nobody is sent to
 * something that isn't there. Each such one links to its page.
 */
function checkAvoid(components) {
  const library = new Map(components.flatMap(component => [
    [component.element, { slug: component.slug, attributes: component.inputs.attributes }],
    ...Object.entries(component.inputs.parts ?? {}).map(([element, part]) => [element, { slug: component.slug, attributes: part.attributes }])
  ]))
  for (const component of components) {
    for (const avoid of component.avoid ?? []) {
      const written = avoid.instead.match(/^(govuk-app-[a-z-]+)((?:\s+[a-z][a-z-]*(?:="[^"]*")?)*)$/)
      if (!written) continue
      const [, element, attributes] = written
      const where = `src/components/${component.slug}/${component.slug}.json says to use ${avoid.instead} instead`
      const target = library.get(element)
      if (!target) throw new Error(`${where}, but there's no such component or part`)
      for (const [, name, value] of attributes.matchAll(/([a-z][a-z-]*)(?:="([^"]*)")?/g)) {
        const spec = target.attributes[name]
        if (!spec) throw new Error(`${where}, but ${element} doesn't read ${name}`)
        if (spec.type === 'enum' && !spec.values.includes(value)) throw new Error(`${where}, but ${name} can't be "${value}"`)
        if (spec.type === 'boolean' && value !== undefined) throw new Error(`${where}, but ${name} is true or false, so takes no value`)
      }
      avoid.element = element
      avoid.slug = target.slug
    }
  }
}
