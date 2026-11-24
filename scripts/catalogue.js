// The catalogue: everything in the library, so a tool building a prototype,
// such as a Claude Code skill, can choose a pattern, template or component
// without opening every definition.
//
//   npm run catalogue    writes it to catalogue/
//
// index.md is what a model reads first: how to choose, and one line for each
// pattern, template and component. A card for each, in components/, patterns/
// and templates/, says the rest, to read only for the ones it's choosing
// between. Reading everything every time would cost far more. catalogue.json
// is all of it as data, for tools.
//
// Like _site/, it's built, not committed: `npm run build` writes it for the
// docs site to publish, and the Release workflow for each release's commit, so
// it's always made from the definitions as they are. Nothing builds it on
// install, which would need the dev dependencies.

import fs from 'node:fs'
import path from 'node:path'

// The docs site's loaders, so the catalogue says only what the site does, and
// a definition the build would refuse never reaches it.
import loadComponents from '../docs/_data/components.js'
import loadPatterns from '../docs/_data/patterns.js'
import loadTemplates from '../docs/_data/templates.js'

const root = path.resolve(import.meta.dirname, '..')
const site = 'https://alphagov.github.io/govuk-mobile-prototype-components'
const out = path.join(root, 'catalogue')

// An example longer than this is a whole screen, which costs more to read than
// it shows about one component.
const longExample = 900

// The index lists components by the job they do, so a reader can go straight
// to the few that might fit. Every component must be in one: the build fails
// on one that isn't, rather than leave it somewhere a reader won't look.
const groups = {
  'Screens and structure': ['screen', 'nav-bar', 'tab-bar', 'sheet', 'full-screen-cover', 'section', 'stack'],
  'Text': ['heading', 'text', 'strong', 'section-heading', 'bulleted-list', 'link'],
  'Actions': ['button', 'button-stack', 'menu-button'],
  'Lists and cards': ['grouped-list', 'link-card', 'summary-columns', 'card-header'],
  'Inputs and controls': ['text-field', 'search-field', 'search-box', 'toggle', 'segmented-control'],
  'Facts and statuses': ['status', 'count', 'labelled-icon', 'number-plate', 'address', 'banner'],
  'Home': ['home-header', 'crown'],
  'Chat': ['chat-question', 'chat-answer', 'chat-loading', 'chat-input', 'chat-example-questions']
}

// What nearly every screen is built from, so a reader knows to read these cards
// whatever else it chooses.
const everyScreen = ['screen', 'nav-bar', 'heading', 'text', 'button', 'button-stack']

/**
 * Every file the catalogue is made of, by its path from the repository's root,
 * with what should be in it.
 */
export function buildCatalogue() {
  const components = loadComponents()
  const patterns = loadPatterns()
  const templates = loadTemplates()

  // Each of the library's elements, and the component whose card it's on: a
  // part, such as a grouped list's row, is on its list's.
  const owners = new Map(components.flatMap(component => [
    [component.element, component],
    ...Object.entries(component.inputs.parts ?? {}).map(([element]) => [element, component])
  ]))
  const resolve = referee(owners, [...patterns, ...templates])

  const catalogue = {
    about: {
      name: 'GOV.UK app prototype components',
      description: 'Web components that look and behave like the GOV.UK app’s own, for prototyping app journeys in HTML. Generated from the definitions by `npm run catalogue`: don’t edit it by hand.',
      docs: `${site}/`,
      index: 'index.md',
      schemas: ['src/schemas/component.schema.json', 'src/schemas/pattern.schema.json', 'src/schemas/template.schema.json']
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
      card: `patterns/${pattern.slug}.md`,
      url: `${site}/patterns/${pattern.slug}/`
    })),
    templates: templates.map(template => ({
      name: template.name,
      slug: template.slug,
      purpose: template.purpose,
      when: template.when,
      avoid: (template.avoid ?? []).map(resolve),
      components: template.components,
      screen: template.screen,
      notes: template.notes ?? [],
      screens: template.screens.map(screen => ({
        ...screen,
        path: `src/templates/${template.slug}/${screen.file}`
      })),
      card: `templates/${template.slug}.md`,
      url: `${site}/templates/${template.slug}/about/`
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
      script: `src/components/${component.slug}/${component.slug}.js`,
      card: `components/${component.slug}.md`,
      url: `${site}/components/${component.slug}/`
    }))
  }

  // Cards link to each other by their paths from one card to another.
  const link = {
    component: element => `../components/${owners.get(element).slug}.md`,
    pattern: slug => `../patterns/${slug}.md`,
    template: slug => `../templates/${slug}.md`
  }

  return new Map([
    ['catalogue.json', `${JSON.stringify(catalogue, null, 2)}\n`],
    ['index.md', renderIndex(catalogue)],
    ...catalogue.patterns.map(pattern => [pattern.card, renderPattern(pattern, link)]),
    ...catalogue.templates.map(template => [template.card, renderTemplate(template, link)]),
    ...catalogue.components.map(component => [component.card, renderComponent(component, link)])
  ])
}

/**
 * What to use instead, as data where it names something in the library: an
 * element, with any attributes it's written with, or a pattern or template by
 * name, so a tool can follow it without reading the words.
 */
function referee(owners, screens) {
  const attributesOf = element => {
    const owner = owners.get(element)
    return owner.element === element ? owner.inputs.attributes : owner.inputs.parts[element].attributes
  }
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
    if (!written || !owners.has(written[1])) return ref
    const [, element, list] = written
    ref.instead.element = element
    const attributes = {}
    for (const [, name, value] of list.matchAll(/([a-z][a-z-]*)(?:="([^"]*)")?/g)) {
      // Only what the element reads: the words after it are not attributes.
      if (!attributesOf(element)[name]) break
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

function renderIndex({ about, patterns, templates, components }) {
  const lines = [
    `# ${about.name}: catalogue`,
    '',
    `${about.description} Docs: ${about.docs}`,
    '',
    'Read this index first. Then read the cards it links to, each a few hundred words, only for what you might use. All of it, as data: catalogue.json. Paths to files, such as src/components/button/button.js, are from the root of the library: the same in its repository, its npm package and its docs site.',
    '',
    '## How to choose',
    '',
    '1. **A template or pattern that fits.** Start from it, and change its words. A pattern is one whole screen; a template is a journey of several.',
    '2. **Otherwise, components.** Put a screen together from them, following each one’s rules.',
    '3. **Build something custom only when nothing fits.** Match the library’s look: style it with the `--app-*` tokens in src/foundation/tokens.css, for colour, type and spacing on the 8pt grid. Tell the user it isn’t one of the app’s components.',
    '',
    'Don’t choose from this index alone: a line here can’t say when something is the wrong choice. Read the cards of your candidates, and the cards their “Avoid” entries point to, then decide.',
    '',
    'A component marked **not in the app yet** is proposed, from future designs. Use it if it fits, and tell the user it isn’t in the app today.',
    '',
    '## How a page is put together',
    '',
    '- Write the components inside one `<govuk-app>`, with one `<govuk-app-screen>` in it for each screen. Put it in a `<govuk-prototype-frame>` (src/frame/frame.js) to show it on an iPhone.',
    '- Load each component’s script, given on its card: `<script type="module" src="src/components/button/button.js"></script>`.',
    '- Components send no events of their own: their buttons, links and fields do, with the `name` and `value` given them. A page listens for clicks by name, and goes where the app would. Add `works` to a button the page acts on.',
    '- Use Material Symbols names for icons, such as `check` or `directions_car`.',
    '',
    `Every screen uses: ${everyScreen.map(slug => {
      const component = components.find(component => component.slug === slug)
      return `[${component.name}](components/${slug}.md)`
    }).join(', ')}.`,
    '',
    '## Patterns',
    '',
    ...patterns.map(pattern => `- [${pattern.name}](patterns/${pattern.slug}.md): ${firstSentence(pattern.purpose)}`),
    '',
    '## Templates',
    '',
    ...(templates.length
      ? templates.map(template => `- [${template.name}](templates/${template.slug}.md): ${firstSentence(template.purpose)}`)
      : ['None yet.']),
    ''
  ]

  const grouped = new Map(Object.keys(groups).map(group => [group, []]))
  for (const component of components) {
    const group = Object.keys(groups).find(group => groups[group].includes(component.slug))
    if (!group) {
      throw new Error(`src/components/${component.slug} isn't in any of the catalogue index's groups. Add '${component.slug}' to the group it belongs in, in groups in scripts/catalogue.js.`)
    }
    grouped.get(group).push(component)
  }
  lines.push('## Components', '')
  for (const [group, members] of grouped) {
    if (!members.length) continue
    const order = groups[group] ?? []
    members.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
    lines.push(`### ${group}`, '', ...members.map(component =>
      `- [${component.name}](components/${component.slug}.md) \`${component.element}\`: ${component.inApp ? '' : '**Not in the app yet.** '}${firstSentence(component.purpose)}`), '')
  }

  return finish(lines)
}

function renderPattern(pattern, link) {
  const lines = [
    `# ${pattern.name} (pattern)`,
    '',
    pattern.purpose,
    '',
    'Use when:',
    ...pattern.when.map(when => `- ${when}`),
    ''
  ]
  if (pattern.avoid.length) lines.push('Avoid:', ...pattern.avoid.map(avoid => describeAvoid(avoid, link)), '')
  lines.push(`Components: ${pattern.components.map(element => `[\`${element}\`](${link.component(element)})`).join(', ')}`, '')
  if (pattern.notes.length) lines.push('Notes:', ...pattern.notes.map(note => `- ${note}`), '')
  lines.push('```html', pattern.html, '```', '', `Docs: ${pattern.url}`)
  return finish(lines)
}

function renderTemplate(template, link) {
  const lines = [`# ${template.name} (template)`, '', template.purpose, '']
  if (template.when.length) lines.push('Use when:', ...template.when.map(when => `- ${when}`), '')
  if (template.avoid.length) lines.push('Avoid:', ...template.avoid.map(avoid => describeAvoid(avoid, link)), '')
  if (template.screens.length) {
    lines.push('Screens, in the repository and the package:', ...template.screens.map(screen =>
      `- ${screen.title}: ${screen.path}${screen.description ? `. ${screen.description}` : ''}`), '')
  }
  if (template.components.length) {
    lines.push(`Components: ${template.components.map(element => `[\`${element}\`](${link.component(element)})`).join(', ')}`, '')
  }
  if (template.notes.length) lines.push('Notes:', ...template.notes.map(note => `- ${note}`), '')
  lines.push(`Docs: ${template.url}`)
  return finish(lines)
}

function renderComponent(component, link) {
  const kind = component.kind === 'govuk' ? 'GOV.UK app component' : 'Native component'
  const lines = [
    `# ${component.name} \`<${component.element}>\``,
    '',
    `${kind}. ${component.inApp ? 'In the app.' : `**Not in the app yet**: proposed, from ${component.proposed.replace(/\.$/, '')}.`}`,
    '',
    `Load: \`<script type="module" src="${component.script}"></script>\``,
    '',
    component.purpose,
    ''
  ]
  lines.push(...describeAttributes(component.attributes))
  if (component.content) lines.push(`Content: ${component.content}`, '')
  for (const [element, part] of Object.entries(component.parts ?? {})) {
    lines.push(`Part \`<${element}>\`: ${part.description}`, '', ...describeAttributes(part.attributes))
  }
  lines.push('Rules:', ...component.rules.map(rule => `- ${rule}`), '')
  lines.push('Avoid:', ...component.avoid.map(avoid => describeAvoid(avoid, link)), '')
  for (const example of component.examples) lines.push(`Example, ${example.name}:`, '```html', example.html, '```', '')
  lines.push(`Docs: ${component.url}`)
  return finish(lines)
}

function describeAttributes(attributes) {
  const entries = Object.entries(attributes)
  if (!entries.length) return []
  return ['Attributes:', ...entries.map(([name, spec]) => {
    const type = spec.type === 'enum' ? spec.values.join(' | ') : spec.type
    const facts = [type, spec.required && 'required', spec.default !== undefined && `default ${spec.default}`]
    return `- \`${name}\` (${facts.filter(Boolean).join(', ')}): ${spec.description}`
  }), '']
}

function describeAvoid({ when, instead }, link) {
  const text = /^govuk-app-/.test(instead.text) ? `\`${instead.text}\`` : instead.text
  const card = instead.pattern ? link.pattern(instead.pattern)
    : instead.template ? link.template(instead.template)
      : instead.element ? link.component(instead.element)
        : null
  return `- ${when.replace(/\.$/, '')}. Instead: ${text.replace(/\.$/, '')}${card ? ` (see ${card})` : ''}`
}

// The first sentence, for the index's one line: up to a full stop that ends
// one, not one inside a word, such as GOV.UK.
const firstSentence = text => text.match(/^.*?[^.]\.(?=\s|$)/)?.[0] ?? text

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const finish = lines => `${lines.join('\n').trimEnd()}\n`

// Run, rather than imported. Clears the folder first, so nothing is left from
// a component or pattern that's gone.
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const built = buildCatalogue()
  fs.rmSync(out, { recursive: true, force: true })
  for (const [file, content] of built) {
    fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true })
    fs.writeFileSync(path.join(out, file), content)
  }
  console.log(`Wrote catalogue/: index.md (${Buffer.byteLength(built.get('index.md'))} bytes), catalogue.json and ${built.size - 2} cards`)
}
