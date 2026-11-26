#!/usr/bin/env node
// Makes a new prototype of the GOV.UK app, ready to open in Claude Code.
//
//   npx --yes <a release's download> new "Renew a passport"
//   npx --yes <a release's download> new "Renew a passport" --from settings
//   npx --yes <a release's download> new "Renew a passport" --from blank
//
// It makes a folder for the prototype in the current one, installs the
// components into it at the latest release, copies in the starter (the
// server, the start page, prototype.js, CLAUDE.md and the skills Claude uses
// to work on it) and the screens it starts from, and saves a first version
// if git is there. Whoever runs it needs only Node.js.
//
// No dependencies, and nothing runs on install: it's run with npx.

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { prototypePath } from '../starter/scripts/refresh-starter.js'
import { compareVersions, downloadUrl, latestRelease, parseVersion } from '../starter/scripts/release.js'

const packageRoot = path.resolve(import.meta.dirname, '..', '..')
const ownStarter = path.resolve(import.meta.dirname, '..', 'starter')
const usage = `Usage: govuk-app-prototype new "<name>" [--from settings,home,chat | blank]`

// Home, Settings and Chat's tab bars link to each other, so they come together.
const tabs = ['home', 'settings', 'chat']

function stop(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

function step(message) {
  console.log(`- ${message}`)
}

const [command, ...rest] = process.argv.slice(2)
if (command !== 'new') stop(usage)

let name
let from = ['settings']
let components
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--from') from = (rest[++i] ?? '').split(',').map(part => part.trim().toLowerCase()).filter(Boolean)
  // A download of the components to use instead of the latest release, such
  // as one being tested before it's released.
  else if (rest[i] === '--components') components = rest[++i]
  else if (!name) name = rest[i]
  else stop(usage)
}
if (!name?.trim()) stop(usage)
if (!from.length) stop(usage)
if (from.some(choice => tabs.includes(choice))) from = [...new Set([...from, ...tabs])]

const slug = name.trim().toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'prototype'
const folder = path.resolve(slug)
if (fs.existsSync(folder) && fs.readdirSync(folder).length) {
  stop(`There's already a folder called ${slug} here, with things in it. Choose another name, or remove that folder first.`)
}

console.log(`\nMaking your prototype, ${name.trim()}, in ${folder}\n`)

// The release to install: the latest, or this one if it's newer, as a copy
// of npx may be out of date. A copy that isn't a release, such as one from
// main, needs the latest.
if (!components) {
  const own = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8')).version
  const ownVersion = parseVersion(own)
  const released = ownVersion && compareVersions(ownVersion, [0, 0, 0]) > 0
  let latest
  try {
    latest = await latestRelease()
  } catch (error) {
    if (!released) stop(error.message)
  }
  components = latest && (!released || compareVersions(latest.version, ownVersion) >= 0)
    ? latest.url
    : downloadUrl(`v${own}`)
}

fs.mkdirSync(folder, { recursive: true })
fs.writeFileSync(path.join(folder, 'package.json'), `${JSON.stringify({
  name: slug,
  version: '0.0.0',
  private: true,
  type: 'module',
  description: `A prototype of the GOV.UK app: ${name.trim()}.`,
  scripts: { start: 'node server.js', screenshots: 'node scripts/screenshots.js' },
  engines: { node: '>=22.16' },
  dependencies: { 'govuk-mobile-prototype-components': components }
}, null, 2)}\n`)

step('Downloading the GOV.UK app components')
const install = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], { cwd: folder, encoding: 'utf8' })
if (install.status !== 0) {
  const detail = `${install.stderr ?? ''}${install.error?.message ?? ''}`.trim().split('\n').slice(-5).join('\n')
  stop(`Couldn't download the GOV.UK app components. Check the internet connection, and try again.\n\n${detail}`)
}

// The starter from the components just installed, so it matches them.
const installed = path.join(folder, 'node_modules', 'govuk-mobile-prototype-components', 'src', 'starter')
const starter = fs.existsSync(installed) ? installed : ownStarter

step('Copying in the starter files and Claude’s skills')
for (const entry of fs.readdirSync(starter)) {
  // Where each goes is refresh-starter's, which updates them later.
  fs.cpSync(path.join(starter, entry), path.join(folder, prototypePath(entry)), { recursive: true })
}
const manifestFile = path.join(folder, 'prototype.json')
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
manifest.name = name.trim()
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)

step(`Adding the screens: ${from.join(', ')}`)
const screens = spawnSync(process.execPath, ['scripts/add-screens.js', ...from], { cwd: folder, encoding: 'utf8' })
if (screens.status !== 0) stop(`Couldn't add the screens: ${screens.stderr.trim()}`)

// A history of versions, so a change can be undone, if git is there. On a Mac
// without Apple's developer tools, git is a stand-in that asks to install
// them, so don't touch it there.
function hasGit() {
  if (process.platform === 'darwin' && spawnSync('xcode-select', ['-p']).status !== 0) {
    const which = spawnSync('which', ['git'], { encoding: 'utf8' }).stdout?.trim()
    if (!which || which === '/usr/bin/git') return false
  }
  return spawnSync('git', ['--version']).status === 0
}
if (hasGit()) {
  const git = (...args) => spawnSync('git', args, { cwd: folder, encoding: 'utf8' })
  git('init', '--quiet')
  if (git('config', 'user.name').status !== 0) git('config', 'user.name', 'Prototype')
  if (git('config', 'user.email').status !== 0) git('config', 'user.email', 'prototype@localhost')
  git('add', '--all')
  if (git('commit', '--quiet', '--message', 'Start the prototype').status === 0) step('Saving the first version')
}

console.log(`
Your prototype is ready, in ${folder}

Next, open Claude Code in that folder and say “open my prototype”:

  cd "${folder}"
  claude
`)
