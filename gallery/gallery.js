// Draws every component's definition file as a page: what it is for, its
// inputs, outputs and rules, each example in light and dark, and the app's
// own screenshots to compare it with.
//
// Add a component's folder name here when it is built.
const components = ['button']

const root = new URL('../', import.meta.url)
const gallery = document.getElementById('gallery')

const make = (tag, props = {}, ...children) => {
  const element = Object.assign(document.createElement(tag), props)
  element.append(...children.filter(child => child !== null && child !== undefined))
  return element
}

async function show(name) {
  const base = new URL(`components/${name}/`, root)
  const [definition] = await Promise.all([
    fetch(new URL(`${name}.json`, base)).then(response => response.json()),
    import(new URL(`${name}.js`, base)),
  ])
  const section = make('section', { className: 'gallery-component', id: name })

  section.append(
    make('h2', {}, definition.name, ' ', make('code', {}, `<${definition.element}>`)),
    make('p', { className: 'gallery-purpose' }, definition.purpose),
    make('p', { className: 'gallery-origin' },
      make('strong', { className: `gallery-kind gallery-kind--${definition.origin.kind}` },
        definition.origin.kind === 'native' ? 'Mirrors a native control' : 'GOV.UK app component'),
      ' ', definition.origin.notes),
  )

  // Examples, live, in light and dark.
  section.append(make('h3', {}, 'Examples'))
  for (const example of definition.examples) {
    const row = make('div', { className: 'gallery-example' }, make('h4', {}, example.name))
    const frames = make('div', { className: 'gallery-frames' })
    for (const scheme of ['light', 'dark']) {
      const app = make('govuk-app', { className: 'gallery-frame' })
      app.setAttribute('colour-scheme', scheme)
      const markup = document.createElement('template')
      markup.innerHTML = example.html // Our own definition file's HTML.
      app.append(markup.content)
      frames.append(app)
    }
    row.append(frames, make('pre', {}, make('code', {}, example.html)))
    section.append(row)
  }

  // Inputs and outputs.
  section.append(make('h3', {}, 'Inputs'))
  const attributes = make('tbody')
  for (const [attribute, spec] of Object.entries(definition.inputs.attributes)) {
    const type = spec.type === 'enum' ? spec.values.map(value => `"${value}"`).join(' | ') : spec.type
    attributes.append(make('tr', {},
      make('td', {}, make('code', {}, attribute)),
      make('td', {}, make('code', {}, type)),
      make('td', {}, spec.default === undefined ? '' : make('code', {}, String(spec.default))),
      make('td', {}, spec.description)))
  }
  section.append(
    make('table', {}, make('thead', {}, make('tr', {}, ...['Attribute', 'Type', 'Default', ''].map(text => make('th', {}, text)))), attributes),
    make('p', {}, make('strong', {}, 'Content: '), definition.inputs.content ?? 'none'),
    make('h3', {}, 'Outputs'),
    make('ul', {}, ...definition.outputs.events.map(event => make('li', {}, make('code', {}, event.name), ': ', event.description))),
    make('h3', {}, 'Rules'),
    make('ul', {}, ...definition.rules.map(rule => make('li', {}, rule))),
  )

  // What it copies, and the app's own screenshots.
  section.append(make('h3', {}, 'Sources'))
  const sources = make('ul')
  for (const platform of ['ios', 'android']) {
    for (const source of definition.sources[platform]) {
      sources.append(make('li', {}, `${platform === 'ios' ? 'iOS' : 'Android'}: `, make('code', {}, source.symbol), ` in ${source.repo}/${source.path}`, source.ref ? ` at ${source.ref}` : ''))
    }
  }
  for (const link of [...definition.sources.figma, ...(definition.sources.other ?? [])]) {
    sources.append(make('li', {}, make('a', { href: link.url }, link.title)))
  }
  if (definition.sources.figma.length === 0) sources.append(make('li', {}, 'Figma: none linked yet'))
  section.append(sources)

  if (definition.references?.length) {
    section.append(make('h3', {}, 'In the app'))
    const grid = make('div', { className: 'gallery-references' })
    for (const reference of definition.references) {
      grid.append(make('figure', {},
        make('img', { src: new URL(reference.image, base).href, alt: `${reference.platform} app: ${reference.description}`, loading: 'lazy' }),
        make('figcaption', {}, `${reference.platform === 'ios' ? 'iOS' : 'Android'}: ${reference.description}`)))
    }
    section.append(grid)
  }

  return section
}

const sections = await Promise.all(components.map(name => show(name).catch(error => {
  console.error(error)
  return make('section', { className: 'gallery-component' }, make('h2', {}, name), make('p', { className: 'gallery-error' }, `Could not draw this component: ${error.message}`))
})))
gallery.replaceChildren(...sections)

// Show which button was pressed, as a prototype's page would listen for it.
gallery.addEventListener('click', event => {
  const button = event.target.closest('govuk-app button')
  if (button) console.log('pressed', { name: button.name || null, value: button.value || null, text: button.textContent })
})
