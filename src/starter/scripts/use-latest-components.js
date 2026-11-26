// Points package.json at the latest release of the GOV.UK app prototype
// components. Then run npm install.
//
//   node scripts/use-latest-components.js
//
// A prototype keeps the release it was made with until someone chooses to
// update, so a change to the components never surprises it.

import fs from 'node:fs'
import path from 'node:path'

import { latestRelease } from './release.js'

const file = path.join(import.meta.dirname, '..', 'package.json')
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))

try {
  const { tag, url } = await latestRelease()
  pkg.dependencies['govuk-mobile-prototype-components'] = url
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
  console.log(`Using ${tag}. Now run npm install.`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
