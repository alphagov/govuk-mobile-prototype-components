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
import { attributesOf, elementMap, parseAvoidElement } from './definitions.js'

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
  checkGroups(components)

  // Each of the library's elements, and the component whose card it's on: a
  // part, such as a grouped list's row, is on its list's.
  const owners = elementMap(components)

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
      avoid: pattern.avoid.map(insteadOfPattern),
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
      avoid: component.avoid.map(avoid => insteadOfComponent(avoid, owners)),
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
    // Each component's kind, as the docs site names it.
    ...catalogue.components.map((component, index) => [component.card, renderComponent(component, components[index].kind.one, link)])
  ])
}

/**
 * Every component in the index's groups is in the library, and every one in
 * the library is in a group, so none is left where a reader won't look.
 */
function checkGroups(components) {
  const slugs = new Set(components.map(component => component.slug))
  for (const [group, members] of Object.entries(groups)) {
    for (const slug of members.filter(slug => !slugs.has(slug))) {
      throw new Error(`'${slug}' is in the catalogue index's ${group} group, in scripts/catalogue.js, but there's no src/components/${slug}/${slug}.json. Remove it, or correct its name.`)
    }
  }
  for (const slug of everyScreen.filter(slug => !slugs.has(slug))) {
    throw new Error(`'${slug}' is in everyScreen, in scripts/catalogue.js, but there's no src/components/${slug}/${slug}.json. Remove it, or correct its name.`)
  }
  const grouped = new Set(Object.values(groups).flat())
  for (const slug of slugs) {
    if (!grouped.has(slug)) {
      throw new Error(`src/components/${slug} isn't in any of the catalogue index's groups. Add '${slug}' to the group it belongs in, in groups in scripts/catalogue.js.`)
    }
  }
}

/**
 * What to use instead of a pattern, with the pattern it names, if any, so a
 * tool can follow it without reading the words. The site's data has already
 * matched it, so its page and its card link to the same one.
 */
function insteadOfPattern({ when, instead, slug }) {
  return { when, instead: { text: instead, ...(slug && { pattern: slug }) } }
}

/**
 * What to use instead of a component, with the element it names, if any, and
 * the attributes it's written with, so a tool can follow it without reading
 * the words.
 */
function insteadOfComponent({ when, instead }, owners) {
  const ref = { when, instead: { text: instead } }
  const written = parseAvoidElement(instead)
  if (!written || !owners.has(written.element)) return ref
  const { element } = written
  ref.instead.element = element
  const attributes = {}
  for (const [name, value] of written.attributes) {
    // Only what the element reads: the words after it are not attributes.
    if (!attributesOf(owners.get(element), element)[name]) break
    attributes[name] = value ?? true
  }
  if (Object.keys(attributes).length) ref.instead.attributes = attributes
  return ref
}

/**
 * One or two of a component's examples: its first, which a definition gives as
 * the usual case, and the shortest of the rest, to show another state. Whole
 * screens are left out where there's anything shorter, as they say more about
 * the screen than the component.
 */
function pickExamples(component) {
  const short = component.examples.filter(example => example.html.length <= longExample)
  const [first, ...rest] = short.length ? short : [shortest(component.examples)]
  // A proposed state is less likely to be what's wanted than one in the app.
  const others = rest.filter(example => component.proposed || !/^Proposed/.test(example.name))
  return [first, shortest(others)].filter(Boolean).map(({ name, html }) => ({ name, html }))
}

// The first of the shortest, or nothing from nothing.
const shortest = examples => examples.reduce((a, b) => (b.html.length < a.html.length ? b : a), examples[0])

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
    `Every screen uses: ${everyScreen.map(slug => `[${components.find(component => component.slug === slug).name}](components/${slug}.md)`).join(', ')}.`,
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

  // In each group's order. checkGroups has made sure each is in one.
  lines.push('## Components', '')
  for (const [group, slugs] of Object.entries(groups)) {
    lines.push(`### ${group}`, '', ...slugs.map(slug => components.find(component => component.slug === slug)).map(component =>
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

function renderComponent(component, kind, link) {
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
