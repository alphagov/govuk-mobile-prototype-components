// Adds screens to a prototype: the library's templates, or a blank screen.
//
//   node scripts/add-screens.js settings home chat
//   node scripts/add-screens.js blank
//
// Each template's pages are copied from the installed library into
// screens/<template>/, with their paths to the library changed to /library/,
// where the prototype's server has it, and prototype.js added, so answers
// carry from screen to screen. Each page is listed in prototype.json, for the
// start page. A blank screen goes in screens/start/.
//
// It never overwrites a screen that's there already: it says so and stops.

import fs from 'node:fs'
import path from 'node:path'

import { libraryFiles as library } from '../library.js'

const choices = process.argv.slice(2)
if (!choices.length) {
  console.error('Usage: node scripts/add-screens.js <template…|blank>')
  process.exit(1)
}

// The prototype this script is in.
const root = path.resolve(import.meta.dirname, '..')
const manifestFile = path.join(root, 'prototype.json')

if (!fs.existsSync(library)) {
  console.error(`The library isn't installed in ${root}: run npm install there first.`)
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
manifest.screens ??= []

/** A page from the library, ready to serve from the prototype. */
function adapt(html) {
  return html
    // ../../components/button/button.js, and the like, to /library/components/button/button.js.
    .replace(/(?:\.\.\/)+(components|foundation|frame)\//g, '/library/$1/')
    // Answers carry between screens. After the frame, before the components.
    .replace(/(<script type="module" src="\/library\/frame\/frame\.js"><\/script>\n)/, '$1  <script type="module" src="/prototype.js"></script>\n')
}

function addTemplate(name) {
  const source = path.join(library, 'templates', name)
  const definitionFile = path.join(source, `${name}.json`)
  if (!fs.existsSync(definitionFile)) {
    const known = fs.readdirSync(path.join(library, 'templates')).join(', ')
    throw new Error(`There's no template called ${name}. The library has: ${known}.`)
  }
  const target = path.join(root, 'screens', name)
  if (fs.existsSync(target)) throw new Error(`screens/${name} is there already, so it wasn't copied again.`)

  const definition = JSON.parse(fs.readFileSync(definitionFile, 'utf8'))
  fs.mkdirSync(target, { recursive: true })
  for (const file of fs.readdirSync(source)) {
    if (!file.endsWith('.html')) continue
    fs.writeFileSync(path.join(target, file), adapt(fs.readFileSync(path.join(source, file), 'utf8')))
  }
  for (const screen of definition.screens) {
    manifest.screens.push({
      title: screen.title,
      path: `/screens/${name}/${screen.file}`,
      description: screen.description,
      group: definition.name
    })
  }
  return definition.screens.length
}

const blank = `<!doctype html>
<!--
  A screen of the prototype. Change what's inside <govuk-app-screen>.
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Start – GOV.UK app prototype</title>
  <script type="module" src="/library/frame/frame.js"></script>
  <script type="module" src="/prototype.js"></script>
  <script type="module" src="/library/components/screen/screen.js"></script>
  <script type="module" src="/library/components/nav-bar/nav-bar.js"></script>
  <script type="module" src="/library/components/text/text.js"></script>
</head>
<body>
  <govuk-prototype-frame>
    <govuk-app highlight-actions>
      <govuk-app-screen>
        <govuk-app-nav-bar title="Start" large-title></govuk-app-nav-bar>
        <govuk-app-text>This is a blank screen. Ask Claude to put something on it.</govuk-app-text>
      </govuk-app-screen>
    </govuk-app>
  </govuk-prototype-frame>
</body>
</html>
`

function addBlank() {
  const target = path.join(root, 'screens', 'start')
  if (fs.existsSync(target)) throw new Error('screens/start is there already, so a blank screen wasn\'t added.')
  fs.mkdirSync(target, { recursive: true })
  fs.writeFileSync(path.join(target, 'index.html'), blank)
  manifest.screens.push({ title: 'Start', path: '/screens/start/index.html', description: 'A blank screen to start from.' })
  return 1
}

try {
  for (const choice of choices) {
    const count = choice === 'blank' ? addBlank() : addTemplate(choice)
    console.log(`Added ${choice}: ${count} screen${count === 1 ? '' : 's'}`)
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
}
