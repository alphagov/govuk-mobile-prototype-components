import fs from 'node:fs'
import path from 'node:path'

import { loadComponents } from '../../scripts/definitions.js'

// Every component's definition, src/components/<name>/<name>.json, checked
// against src/schemas/component.schema.json, its script and the rest of the
// library. A component's page is drawn from this, so a folder with a
// definition is all it takes to get one.
const root = path.resolve(import.meta.dirname, '../..')

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
  // By group, then by name. Each one's place is its order in the sidebar,
  // which groups them.
  return loadComponents()
    .map(component => {
      // Prose about the component that the definition can't say well, if any.
      const prose = path.join('src', 'components', component.slug, `${component.slug}.md`)
      return {
        ...component,
        kind: kinds[component.origin.kind],
        group: component.proposed ? proposed : kinds[component.origin.kind].many,
        prose: fs.existsSync(path.join(root, prose)) ? prose : undefined
      }
    })
    .sort((a, b) =>
      groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
      a.name.localeCompare(b.name))
    .map((component, index) => ({ ...component, order: index }))
}
