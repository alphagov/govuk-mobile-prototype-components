// The catalogue: everything in the library in two files at the repository's
// root, so a tool building a prototype, such as a Claude Code skill, can choose
// a pattern, template or component without opening every definition.
//
//   npm run catalogue                 writes catalogue.json and catalogue.md
//   node scripts/catalogue.js --check fails if they aren't what it would write
//
// catalogue.json is the data. catalogue.md says the same, compactly, for a
// model to read in one go. Both are committed, so they can be read from a
// clone or the npm package without building anything, and `npm run build`
// checks them, so they can't fall behind the definitions.

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

// The docs site's loaders, so the catalogue says only what the site does, and
// a definition the build would refuse never reaches it.
import loadComponents from '../docs/_data/components.js'
import loadPatterns from '../docs/_data/patterns.js'

const root = path.resolve(import.meta.dirname, '..')
const site = 'https://alphagov.github.io/govuk-mobile-prototype-components'
const files = {
  json: path.join(root, 'catalogue.json'),
  md: path.join(root, 'catalogue.md')
}

// An example longer than this is a whole screen, which costs more to read than
// it shows about one component.
const longExample = 900

export function buildCatalogue() {
  const components = loadComponents()
  const patterns = loadPatterns()
  const templates = loadTemplates()

  const resolve = referee(components, [...patterns, ...templates])

  const catalogue = {
    about: {
      name: 'GOV.UK app prototype components',
      description: 'Web components that look and behave like the GOV.UK app’s own, for prototyping app journeys in HTML. Generated from the definitions by `npm run catalogue`: don’t edit it by hand.',
      docs: `${site}/`,
      schemas: ['component.schema.json', 'pattern.schema.json']
    },
    patterns: patterns.map(pattern => ({
      name: pattern.name,
      slug: pattern.slug,
      purpose: pattern.purpose,
      when: pattern.when,
      avoid: pattern.avoid.map(resolve),
      components: pattern.components,
      screen: pattern.screen,
      notes: pattern.notes ?? [],
      html: pattern.html,
      url: `${site}/patterns/${pattern.slug}/`
    })),
    templates: templates.map(template => ({
      name: template.name,
      slug: template.slug,
      purpose: template.purpose,
      when: template.when ?? [],
      avoid: (template.avoid ?? []).map(resolve),
      components: template.components ?? [],
      screen: template.screen,
      screens: (template.screens ?? []).map(screen => ({
        ...screen,
        path: `templates/${template.slug}/${screen.file}`
      }))
    })),
    components: components.map(component => ({
      name: component.name,
      element: component.element,
      slug: component.slug,
      kind: component.origin.kind,
      inApp: !component.proposed,
      ...(component.proposed && { proposed: component.proposed.design }),
      purpose: component.purpose,
      attributes: component.inputs.attributes,
      content: component.inputs.content,
      contains: component.inputs.contains,
      ...(component.inputs.parts && { parts: component.inputs.parts }),
      rules: component.rules,
      avoid: component.avoid.map(resolve),
      examples: pickExamples(component),
      script: `components/${component.slug}/${component.slug}.js`,
      url: `${site}/components/${component.slug}/`
    }))
  }

  return {
    json: `${JSON.stringify(catalogue, null, 2)}\n`,
    md: toMarkdown(catalogue)
  }
}

/**
 * Templates, whole journeys of several screens, from templates/<name>/<name>.json,
 * if there are any yet. The docs site has no loader for them yet, so this reads
 * them as they are.
 */
function loadTemplates() {
  const directory = path.join(root, 'templates')
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => ({ slug: entry.name, file: path.join(directory, entry.name, `${entry.name}.json`) }))
    .filter(({ file }) => fs.existsSync(file))
    .map(({ slug, file }) => ({ ...JSON.parse(fs.readFileSync(file, 'utf8')), slug }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * What to use instead, as data where it names something in the library: an
 * element, with any attributes it's written with, or a pattern or template by
 * name, so a tool can follow it without reading the words.
 */
function referee(components, screens) {
  const elements = new Map(components.flatMap(component => [
    [component.element, component.inputs.attributes],
    ...Object.entries(component.inputs.parts ?? {}).map(([element, part]) => [element, part.attributes])
  ]))
  // Longest first, so a name that starts with another's isn't taken for it.
  const named = [...screens].sort((a, b) => b.name.length - a.name.length)

  return ({ when, instead }) => {
    const ref = { when, instead: { text: instead } }

    const screen = named.find(({ name }) => new RegExp(`^${escapeRegExp(name)}(?:$|[,.:;])`, 'i').test(instead))
    if (screen) {
      ref.instead[screen.screens ? 'template' : 'pattern'] = screen.slug
      return ref
    }

    // The first element it names, and the attributes written straight after it.
    const written = instead.match(/(govuk-app-[a-z-]+)((?:\s+[a-z][a-z-]*(?:="[^"]*")?)*)/)
    if (!written || !elements.has(written[1])) return ref
    const [, element, list] = written
    ref.instead.element = element
    const attributes = {}
    for (const [, name, value] of list.matchAll(/([a-z][a-z-]*)(?:="([^"]*)")?/g)) {
      // Only what the element reads: the words after it are not attributes.
      if (!elements.get(element)[name]) break
      attributes[name] = value ?? true
    }
    if (Object.keys(attributes).length) ref.instead.attributes = attributes
    return ref
  }
}

/**
 * One or two of a component's examples: its first, which a definition gives as
 * the usual case, and the shortest of the rest, to show another state. Whole
 * screens are left out where there's anything shorter, as they say more about
 * the screen than the component.
 */
function pickExamples(component) {
  const short = component.examples.filter(example => example.html.length <= longExample)
  const pool = short.length ? short : [component.examples.reduce((a, b) => (a.html.length <= b.html.length ? a : b))]
  const [first, ...rest] = pool
  const second = rest
    // A proposed state is less likely to be what's wanted than one in the app.
    .filter(example => component.proposed || !/^Proposed/.test(example.name))
    .sort((a, b) => a.html.length - b.html.length)[0]
  return [first, second].filter(Boolean).map(({ name, html }) => ({ name, html }))
}

function toMarkdown({ about, patterns, templates, components }) {
  const lines = []
  const add = (...more) => lines.push(...more)

  add(
    `# ${about.name}: catalogue`,
    '',
    `${about.description} The same as data: catalogue.json. Docs: ${about.docs}`,
    '',
    '## How to choose',
    '',
    '1. **A template or pattern that fits.** Start from it, and change its words. A pattern is one whole screen; a template is a journey of several. Each says when to use it, and what to use instead when not.',
    '2. **Otherwise, components.** Put a screen together from them, following each one’s rules, and its “Avoid” to tell apart ones that look alike.',
    '3. **Build something custom only when nothing fits.** Match the library’s look: style it with the `--app-*` tokens in foundation/tokens.css, for colour, type and spacing on the 8pt grid. Tell the user it isn’t one of the app’s components.',
    '',
    'A component marked **not in the app yet** is proposed, from future designs. Use it if it fits, and tell the user it isn’t in the app today.',
    '',
    '## How a page is put together',
    '',
    '- Write the components inside one `<govuk-app>`, with one `<govuk-app-screen>` in it for each screen. Put it in a `<govuk-prototype-frame>` (frame/frame.js) to show it on an iPhone.',
    '- Load each component’s script, given on its entry: `<script type="module" src="components/button/button.js"></script>`.',
    '- Components send no events of their own: their buttons, links and fields do, with the `name` and `value` given them. A page listens for clicks by name, and goes where the app would. Add `works` to a button the page acts on.',
    '- Use Material Symbols names for icons, such as `check` or `directions_car`.',
    ''
  )

  add('## Patterns', '')
  for (const pattern of patterns) {
    add(
      `### ${pattern.name} (pattern: ${pattern.slug})`,
      '',
      pattern.purpose,
      '',
      'Use when:',
      ...pattern.when.map(when => `- ${when}`),
      '',
      'Avoid:',
      ...pattern.avoid.map(describeAvoid),
      '',
      `Components: ${pattern.components.map(element => `\`${element}\``).join(', ')}`,
      ''
    )
    if (pattern.notes.length) add('Notes:', ...pattern.notes.map(note => `- ${note}`), '')
    add('```html', pattern.html, '```', '', `Docs: ${pattern.url}`, '')
  }

  add('## Templates', '')
  if (!templates.length) add('None yet.', '')
  for (const template of templates) {
    add(`### ${template.name} (template: ${template.slug})`, '', template.purpose, '')
    if (template.when.length) add('Use when:', ...template.when.map(when => `- ${when}`), '')
    if (template.avoid.length) add('Avoid:', ...template.avoid.map(describeAvoid), '')
    if (template.screens.length) {
      add('Screens:', ...template.screens.map(screen =>
        `- ${screen.title} (${screen.path})${screen.description ? `: ${screen.description}` : ''}`), '')
    }
    if (template.components.length) add(`Components: ${template.components.map(element => `\`${element}\``).join(', ')}`, '')
  }

  add('## Components', '')
  for (const component of components) {
    const kind = component.kind === 'govuk' ? 'GOV.UK app component' : 'native component'
    add(`### ${component.name} \`<${component.element}>\``, '')
    add(`${kind}. ${component.inApp ? '' : `**Not in the app yet**: proposed, from ${component.proposed}. `}Script: ${component.script}`, '')
    add(component.purpose, '')
    describeAttributes(component.attributes, add)
    if (component.content) add(`Content: ${component.content}`, '')
    for (const [element, part] of Object.entries(component.parts ?? {})) {
      add(`Part \`<${element}>\`: ${part.description}`, '')
      describeAttributes(part.attributes, add)
    }
    add('Rules:', ...component.rules.map(rule => `- ${rule}`), '')
    add('Avoid:', ...component.avoid.map(describeAvoid), '')
    for (const example of component.examples) add(`Example, ${example.name}:`, '```html', example.html, '```', '')
    add(`Docs: ${component.url}`, '')
  }

  return `${lines.join('\n').trimEnd()}\n`
}

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function describeAttributes(attributes, add) {
  const entries = Object.entries(attributes)
  if (!entries.length) return
  add('Attributes:', ...entries.map(([name, spec]) => {
    const type = spec.type === 'enum' ? spec.values.join(' | ') : spec.type
    const facts = [type, spec.required && 'required', spec.default !== undefined && `default ${spec.default}`]
    return `- \`${name}\` (${facts.filter(Boolean).join(', ')}): ${spec.description}`
  }), '')
}

function describeAvoid({ when, instead }) {
  const target = instead.pattern ? ` (pattern: ${instead.pattern})` : instead.template ? ` (template: ${instead.template})` : ''
  const text = /^govuk-app-/.test(instead.text) ? `\`${instead.text}\`` : instead.text
  return `- ${when.replace(/\.$/, '')}. Instead: ${text.replace(/\.$/, '')}${target}`
}

// Run, rather than imported.
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const { values: options } = parseArgs({ options: { check: { type: 'boolean' } } })
  const built = buildCatalogue()

  if (options.check) {
    const stale = Object.entries(files)
      .filter(([kind, file]) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== built[kind])
      .map(([, file]) => path.basename(file))
    if (stale.length) {
      console.error(`${stale.join(' and ')} ${stale.length > 1 ? 'are' : 'is'} out of date with the definitions. Run \`npm run catalogue\`, and commit what it writes.`)
      process.exit(1)
    }
  } else {
    for (const [kind, file] of Object.entries(files)) fs.writeFileSync(file, built[kind])
    console.log(`Wrote catalogue.json (${Buffer.byteLength(built.json)} bytes) and catalogue.md (${Buffer.byteLength(built.md)} bytes)`)
  }
}
