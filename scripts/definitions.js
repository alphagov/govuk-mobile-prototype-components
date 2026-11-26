// Reads and checks the library's definitions: its components', patterns' and
// templates' .json files. The docs site's data (docs/_data/) and the scripts
// share it, so they check the same things the same way, and refuse the same
// definitions. It's here, not in docs/_data/, since Eleventy would take any
// file there for data.

import fs from 'node:fs'
import path from 'node:path'

import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const root = path.resolve(import.meta.dirname, '..')

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))

// One Ajv for every schema: compiling one is the slow part.
let ajv
const validators = new Map()

function validator(kind) {
  if (!validators.has(kind)) {
    if (!ajv) {
      ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true })
      addFormats(ajv)
    }
    validators.set(kind, ajv.compile(readJson(path.join(root, 'src', 'schemas', `${kind}.schema.json`))))
  }
  return validators.get(kind)
}

/**
 * Every definition of one kind, src/<folder>/<name>/<name>.json, each checked
 * against src/schemas/<kind>.schema.json, by its folder's name. A folder with
 * no definition isn't one of them.
 */
export function loadDefinitions(kind, folder) {
  const validate = validator(kind)
  const definitions = []
  for (const entry of fs.readdirSync(path.join(root, 'src', folder), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const file = `src/${folder}/${slug}/${slug}.json`
    if (!fs.existsSync(path.join(root, file))) continue

    const definition = readJson(path.join(root, file))
    if (!validate(definition)) {
      const errors = validate.errors.map(error => `  ${error.instancePath || '/'} ${error.message}`).join('\n')
      throw new Error(`${file} does not match ${kind}.schema.json:\n${errors}`)
    }
    definitions.push({ ...definition, slug })
  }
  return definitions
}

// Kept for the rest of the process: the site's data, the patterns', the
// templates' and the catalogue all need them. The docs site forgets them
// before each build, so `npm start` sees a changed definition.
let components

/**
 * Every component's definition, checked against the schema, its script, and
 * the other components it names.
 */
export function loadComponents() {
  if (!components) {
    const loaded = loadDefinitions('component', 'components')
    for (const component of loaded) checkAgainstScript(component)
    checkContains(loaded)
    checkAvoid(loaded)
    components = loaded
  }
  return components
}

export function forgetDefinitions() {
  components = undefined
}

/**
 * Each of the library's elements, and the component it belongs to: a part,
 * such as a grouped list's row, belongs to its list.
 */
export function elementMap(components) {
  return new Map(components.flatMap(component => [
    [component.element, component],
    ...Object.keys(component.inputs.parts ?? {}).map(part => [part, component])
  ]))
}

/** The attributes an element of the library reads, whether a component or a part. */
export function attributesOf(owner, element) {
  return owner.element === element ? owner.inputs.attributes : owner.inputs.parts[element].attributes
}

/**
 * The first of the library's elements that some words name, such as
 * govuk-app-button variant="destructive", with the attributes written straight
 * after it. whole is true when that's all the words are, so it's code to
 * check, not words that mention an element.
 */
export function parseAvoidElement(text) {
  const written = text.match(/(govuk-app-[a-z-]+)((?:\s+[a-z][a-z-]*(?:="[^"]*")?)*)/)
  if (!written) return undefined
  const [match, element, list] = written
  return {
    element,
    attributes: [...list.matchAll(/([a-z][a-z-]*)(?:="([^"]*)")?/g)].map(([, name, value]) => [name, value]),
    whole: match === text
  }
}

/**
 * The components some HTML uses, by element: a part counts as its component.
 * Fails on an element the library hasn't got.
 */
export function componentsIn(html, owners, where) {
  const used = new Map()
  for (const [, element] of html.matchAll(/<(govuk-app-[a-z0-9-]+)/g)) {
    const owner = owners.get(element)
    if (!owner) throw new Error(`${where} uses ${element}, but there's no such component or part`)
    used.set(element, owner)
  }
  return used
}

/**
 * A pattern's or template's list of components is what tools choose by, so it
 * must be exactly what its HTML uses: every one, and no more.
 */
export function checkUses(where, declared, used, owners, html = 'its HTML uses') {
  for (const element of declared) {
    if (owners.get(element)?.element !== element) {
      throw new Error(`${where} names ${element}, but there's no such component`)
    }
  }
  const describe = elements => [...elements].sort().join(', ')
  const components = new Set([...used.values()].map(owner => owner.element))
  if (describe(components) !== describe(declared)) {
    throw new Error(`${where} says it uses ${describe(declared)}, but ${html} ${describe(components)}`)
  }
}

/**
 * The elements a component's script defines, each with the attributes it
 * reads: what defineComponent is given, in src/components/<name>/<name>.js.
 */
function definedByScript(slug) {
  const source = fs.readFileSync(path.join(root, 'src', 'components', slug, `${slug}.js`), 'utf8')
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
function checkAgainstScript({ slug, ...definition }) {
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
  const library = elementMap(components)
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
 * something that isn't there. Each such one links to its page, by its slug.
 */
function checkAvoid(components) {
  const owners = elementMap(components)
  for (const component of components) {
    for (const avoid of component.avoid) {
      const written = parseAvoidElement(avoid.instead)
      if (!written?.whole) continue
      const { element, attributes } = written
      const where = `src/components/${component.slug}/${component.slug}.json says to use ${avoid.instead} instead`
      const owner = owners.get(element)
      if (!owner) throw new Error(`${where}, but there's no such component or part`)
      for (const [name, value] of attributes) {
        const spec = attributesOf(owner, element)[name]
        if (!spec) throw new Error(`${where}, but ${element} doesn't read ${name}`)
        if (spec.type === 'enum' && !spec.values.includes(value)) throw new Error(`${where}, but ${name} can't be "${value}"`)
        if (spec.type === 'boolean' && value !== undefined) throw new Error(`${where}, but ${name} is true or false, so takes no value`)
      }
      avoid.element = element
      avoid.slug = owner.slug
    }
  }
}
