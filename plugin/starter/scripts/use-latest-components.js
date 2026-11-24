// Points package.json at the latest release of the GOV.UK app prototype
// components, so the prototype gets that release, and keeps it, until someone
// chooses to update.
//
//   node scripts/use-latest-components.js
//
// Releases are tags on GitHub, v1.2.3, which npm installs from with
// github:alphagov/govuk-mobile-prototype-components#v1.2.3. There's no npm
// package. Then run npm install.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const repository = 'alphagov/govuk-mobile-prototype-components'

// The first release with its files in src/ and its catalogue in it, which
// library.js and the skills expect. main has no catalogue, so never main.
const first = [0, 4, 0]

const file = path.join(import.meta.dirname, '..', 'package.json')
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))

// Over HTTPS, then SSH, as npm tries them, since the repository can need
// the person's own GitHub sign-in. Never stops to ask for a password.
function listTags() {
  for (const url of [`https://github.com/${repository}.git`, `git@github.com:${repository}.git`]) {
    try {
      return execFileSync('git', ['ls-remote', '--tags', '--refs', url, 'v*'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_SSH_COMMAND: 'ssh -o BatchMode=yes' }
      })
    } catch {}
  }
  console.error(`Couldn't read the components' versions from GitHub (${repository}), over HTTPS or SSH. Check the network, and that this computer can sign in to GitHub.`)
  process.exit(1)
}

const tags = listTags()
  .split('\n')
  .map(line => line.match(/refs\/tags\/(v(\d+)\.(\d+)\.(\d+))$/))
  .filter(Boolean)
  .map(([, tag, ...numbers]) => ({ tag, version: numbers.map(Number) }))

const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
const latest = tags.sort((a, b) => compare(b.version, a.version))[0]
if (!latest || compare(latest.version, first) < 0) {
  console.error('The components haven’t been released yet, so there’s no version to make a prototype from. Ask the library’s maintainers.')
  process.exit(1)
}
const ref = latest.tag

pkg.dependencies['govuk-mobile-prototype-components'] = `github:${repository}#${ref}`
fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
console.log(`Using ${ref}`)
