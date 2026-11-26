// Brings a prototype's starter files, and Claude's skills, up to date with
// the components it has just installed, without touching anything the
// designer, or Claude for them, has changed.
//
//   node <the installed library>/starter/scripts/refresh-starter.js --old <a copy of the starter before updating>
//
// Run it in the prototype's folder, from the newly installed library rather
// than the prototype's own copy, so it's always the newest version of this
// rule. For each file in the new starter:
//
//   - the prototype's copy is just as the old release had it: it's replaced
//     with the new one, as no one has changed it
//   - the prototype hasn't got it, and the old release hadn't either: it's
//     added, as it's new
//   - the prototype hasn't got it, but the old release had: it's left out,
//     as someone took it out
//   - the prototype's copy is different from the old release's: it's kept,
//     as someone changed it, and listed, with where the old and new release's
//     copies are, to compare
//
// A file the old release had and the new one hasn't is removed, if no one
// changed it. prototype.json is never touched: it's the prototype's own name
// and screens. Nor is anything outside the starter's files, such as screens/
// and components/.
//
// Without --old, nothing can be known to be unchanged: it only adds what's
// new, and lists everything else that's different as kept.
//
// It prints what it did, as JSON.

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

/**
 * Where a file of the starter goes in a prototype, from its path in the
 * starter. The skills are Claude Code's, so they go in .claude/skills/. npm
 * leaves .gitignore out of packages, so the starter's has no dot.
 */
export function prototypePath(relative) {
  const [first, ...rest] = relative.split(/[\\/]/)
  if (first === 'skills') return path.join('.claude', 'skills', ...rest)
  if (first === 'gitignore' && !rest.length) return '.gitignore'
  return relative
}

// The prototype's own: bin sets its name, and add-screens lists its screens.
const theirs = new Set(['prototype.json'])

/** Every file in a folder, as paths relative to it. */
function filesIn(folder) {
  if (!folder || !fs.existsSync(folder)) return []
  return fs.readdirSync(folder, { recursive: true })
    .filter(file => fs.statSync(path.join(folder, file)).isFile() && path.basename(file) !== '.DS_Store')
    .map(file => file.split(path.sep).join('/'))
    .sort()
}

function same(a, b) {
  return fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b))
}

async function refresh() {
  const { values: options } = parseArgs({ options: { old: { type: 'string' }, prototype: { type: 'string' } } })
  const root = path.resolve(options.prototype ?? '.')
  if (!fs.existsSync(path.join(root, 'prototype.json'))) {
    throw new Error(`${root} isn't a prototype: it has no prototype.json. Run this in the prototype's folder.`)
  }

  // This script's own starter, unless this is the prototype's copy of it:
  // then the starter of the components the prototype has installed.
  let starter = path.resolve(import.meta.dirname, '..')
  if (fs.existsSync(path.join(starter, 'package.json'))) {
    const { libraryFiles } = await import(path.join(starter, 'library.js'))
    starter = path.join(libraryFiles, 'starter')
  }

  const old = options.old ? path.resolve(options.old) : null
  if (old && !fs.existsSync(path.join(old, 'CLAUDE.md'))) {
    throw new Error(`${old} isn't a copy of the starter: it has no CLAUDE.md.`)
  }

  const report = { updated: [], added: [], removed: [], kept: [], leftOut: [] }
  const newFiles = filesIn(starter)
  const oldFiles = new Set(filesIn(old))

  for (const file of newFiles) {
    if (theirs.has(file)) continue
    const target = path.join(root, prototypePath(file))
    const fresh = path.join(starter, file)
    const before = old && oldFiles.has(file) ? path.join(old, file) : null
    const shown = prototypePath(file).split(path.sep).join('/')

    if (!fs.existsSync(target)) {
      if (before) {
        report.leftOut.push(shown)
      } else {
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.copyFileSync(fresh, target)
        report.added.push(shown)
      }
    } else if (same(target, fresh)) {
      // Up to date already.
    } else if (before && same(target, before)) {
      fs.copyFileSync(fresh, target)
      report.updated.push(shown)
    } else {
      report.kept.push({ file: shown, oldRelease: before, newRelease: fresh })
    }
  }

  // Gone from the new release, such as a skill that's been renamed.
  for (const file of oldFiles) {
    if (theirs.has(file) || newFiles.includes(file)) continue
    const target = path.join(root, prototypePath(file))
    const shown = prototypePath(file).split(path.sep).join('/')
    if (!fs.existsSync(target)) continue
    if (same(target, path.join(old, file))) {
      fs.rmSync(target)
      report.removed.push(shown)
      // And its folder, if that's empty now, as a skill's would be.
      for (let folder = path.dirname(target); folder !== root && !fs.readdirSync(folder).length; folder = path.dirname(folder)) {
        fs.rmdirSync(folder)
      }
    } else {
      report.kept.push({ file: shown, oldRelease: path.join(old, file), newRelease: null })
    }
  }

  console.log(JSON.stringify(report, null, 2))
}

if (process.argv[1] === import.meta.filename) {
  try {
    await refresh()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
