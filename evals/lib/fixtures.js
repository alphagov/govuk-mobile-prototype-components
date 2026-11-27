// The folders the skills run in, made fresh for each run of the evals, in the
// computer's temporary folder: never inside this repository, where Claude
// would find the repository's own CLAUDE.md and skills by looking up from
// where it started.
//
//   A prototype, made with the `new` command from `npm pack` of this
//   working tree, so it has the skills and starter as they are now.
//
//   The library: a clone of this repository, with the working tree's
//   skills and AGENTS.md committed on top, whose origin is a bare copy in
//   the same temporary folder. So "my changes" are only what a case adds,
//   origin/main is where the case started, and a push goes nowhere real.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { repo, run, runSync } from './util.js'

/** A folder of the run's own: two runs started in the same second mustn't share one, as each deletes its own at the end. */
export function makeWorkDir(stamp) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `govuk-app-evals-${stamp}-`))
}

let packed
/** The library's package, from this working tree, with its catalogue. */
export function pack(work) {
  if (packed) return packed
  runSync('npm', ['run', 'catalogue', '--silent'], { cwd: repo })
  const dest = path.join(work, 'pack')
  fs.mkdirSync(dest, { recursive: true })
  const name = runSync('npm', ['pack', '--silent', '--pack-destination', dest], { cwd: repo }).trim().split('\n').at(-1)
  packed = path.join(dest, name)
  return packed
}

let prototypeFixture
/** A prototype made with `new`, starting from Settings (so Home and Chat too). Copy it before changing it. */
export function prototype(work) {
  if (prototypeFixture) return prototypeFixture
  const tgz = pack(work)
  const parent = path.join(work, 'fixtures')
  fs.mkdirSync(parent, { recursive: true })
  runSync(process.execPath, [path.join(repo, 'src', 'bin', 'govuk-app-prototype.js'), 'new', 'Eval prototype', '--from', 'settings', '--components', tgz], { cwd: parent })
  prototypeFixture = path.join(parent, 'eval-prototype')
  return prototypeFixture
}

/** A copy of the prototype for one run to change. */
export function copyPrototype(work, name) {
  const dir = path.join(work, 'runs', name, 'prototype')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(dir), { recursive: true })
  fs.cpSync(prototype(work), dir, { recursive: true, verbatimSymlinks: true, filter: from => path.basename(from) !== '.screenshots' })
  return dir
}

let origin
/** The bare repository the library's clones come from, made once. */
function libraryOrigin(work) {
  if (origin) return origin
  const base = path.join(work, 'library-base')
  runSync('git', ['clone', '--quiet', repo, base])
  // The working tree's commit, not whatever main is here.
  const head = runSync('git', ['rev-parse', 'HEAD'], { cwd: repo }).trim()
  runSync('git', ['checkout', '--quiet', '-B', 'main', head], { cwd: base })
  // The skills and rules as they are now, changes not yet committed too.
  for (const item of ['.claude/skills', 'AGENTS.md', 'CLAUDE.md']) {
    const from = path.join(repo, item)
    if (!fs.existsSync(from)) continue
    fs.rmSync(path.join(base, item), { recursive: true, force: true })
    fs.cpSync(from, path.join(base, item), { recursive: true })
  }
  runSync('git', ['add', '--all'], { cwd: base })
  const dirty = runSync('git', ['status', '--porcelain'], { cwd: base }).trim()
  if (dirty) {
    runSync('git', ['-c', 'user.name=Evals', '-c', 'user.email=evals@localhost', 'commit', '--quiet', '-m', 'The skills as they are in the working tree'], { cwd: base })
  }
  origin = path.join(work, 'library-origin.git')
  runSync('git', ['clone', '--quiet', '--bare', base, origin])
  return origin
}

/** A clone of the library for one run, with this repository's node_modules. */
export function cloneLibrary(work, name) {
  const parent = path.join(work, 'runs', name)
  const dir = path.join(parent, 'govuk-mobile-prototype-components')
  fs.rmSync(parent, { recursive: true, force: true })
  fs.mkdirSync(parent, { recursive: true })
  runSync('git', ['clone', '--quiet', libraryOrigin(work), dir])
  runSync('git', ['config', 'user.name', 'Eval designer'], { cwd: dir })
  runSync('git', ['config', 'user.email', 'evals@localhost'], { cwd: dir })
  // Shared, not installed again: a link git is told to ignore, as
  // .gitignore's node_modules/ matches only a folder.
  fs.symlinkSync(path.join(repo, 'node_modules'), path.join(dir, 'node_modules'))
  fs.appendFileSync(path.join(dir, '.git', 'info', 'exclude'), '\nnode_modules\n')
  return dir
}

/** Screenshots of the prototype's own screens, Settings, Home and Chat, as the app's look for the judge. */
export async function referenceScreens(work) {
  const dir = prototype(work)
  const shots = path.join(dir, '.screenshots')
  if (!fs.existsSync(shots) || !fs.readdirSync(shots).length) {
    await run('npm', ['run', 'screenshots', '--silent', '--', '--all'], { cwd: dir, timeoutMs: 5 * 60_000 })
  }
  return fs.existsSync(shots) ? fs.readdirSync(shots).filter(file => file.endsWith('.png')).map(file => path.join(shots, file)) : []
}
