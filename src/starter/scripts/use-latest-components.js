// Points package.json at the latest release of the GOV.UK app prototype
// components. Then run npm install.
//
//   node scripts/use-latest-components.js
//   node scripts/use-latest-components.js --check
//
// A prototype keeps the release it was made with until someone chooses to
// update, so a change to the components never surprises it. --check changes
// nothing: it prints, as JSON, the version this prototype uses, the latest,
// and the notes of each release in between, so whoever's updating can say
// what's new before asking.

import fs from 'node:fs'
import path from 'node:path'

import { compareVersions, latestRelease, releasesSince, versionOf } from './release.js'

// The prototype this is in, or, if this is the library's own copy, such as
// a newer one run for a prototype whose copy is older, the folder it's run in.
const own = path.join(import.meta.dirname, '..')
const root = fs.existsSync(path.join(own, 'package.json')) ? own : process.cwd()
const file = path.join(root, 'package.json')
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
const name = 'govuk-mobile-prototype-components'

/** The version in use: the one package.json asks for, or else the one installed. */
function current() {
  const pinned = versionOf(pkg.dependencies?.[name])
  if (pinned) return pinned
  try {
    const installed = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version
    return installed.split('.').map(Number)
  } catch {
    return null
  }
}

try {
  const latest = await latestRelease()
  if (process.argv.includes('--check')) {
    const using = current()
    const newer = !using || compareVersions(latest.version, using) > 0
    console.log(JSON.stringify({
      using: using ? `v${using.join('.')}` : null,
      latest: latest.tag,
      newer,
      releases: newer && using ? (await releasesSince(using)).map(({ tag, date, notes }) => ({ tag, date, notes })) : []
    }, null, 2))
  } else {
    pkg.dependencies[name] = latest.url
    fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
    console.log(`Using ${latest.tag}. Now run npm install.`)
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
