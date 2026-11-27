#!/usr/bin/env node
// Evals of the skills in this repository and its starter: whether they're
// chosen when they should be, choose well, review well, and do whole jobs
// well. Runs on this computer, with the claude CLI that's installed and
// signed in here, for everything. See evals/README.md.
//
//   npm run evals                          layers 1 to 3, a few minutes
//   npm run evals -- --full                and layer 4, whole tasks, after an estimate
//   npm run evals -- --case <id>           one case, from any layer
//   npm run evals -- --full --runs 3       each whole task 3 times, before a big release
//   npm run evals -- --baseline            also without the skills, to compare
//   npm run evals -- --publish             and publish the results to the docs site
//   npm run evals -- --note "Why"          say why it was run, in the history and on the site
//   npm run evals -- --publish-only <dir>  publish a run that's already done

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { parseArgs } from 'node:util'

import { addUsage, useModel } from './lib/claude.js'
import { makeWorkDir } from './lib/fixtures.js'
import { choosing } from './lib/choosing.js'
import { publish } from './lib/publish.js'
import { summaryLine, writeReport } from './lib/report.js'
import { reviewing } from './lib/reviewing.js'
import { estimate, regradeTask, tasks } from './lib/tasks.js'
import { triggering } from './lib/triggering.js'
import { cases, log, repo, runSync, seconds, writeJson } from './lib/util.js'

const { values: options } = parseArgs({
  options: {
    full: { type: 'boolean' },
    case: { type: 'string' },
    layer: { type: 'string' },
    runs: { type: 'string' },
    baseline: { type: 'boolean' },
    concurrency: { type: 'string' },
    model: { type: 'string' },
    yes: { type: 'boolean' },
    keep: { type: 'boolean' },
    publish: { type: 'boolean' },
    'publish-only': { type: 'string' },
    regrade: { type: 'string' },
    note: { type: 'string' }
  }
})

const outRoot = path.join(repo, 'evals-out')

// Grades a run's whole tasks again, after their checks change, without
// running anything again: see regradeTask.
if (options.regrade) {
  const dir = path.resolve(options.regrade)
  const run = JSON.parse(fs.readFileSync(path.join(dir, 'results.json'), 'utf8'))
  const results = run.layers.tasks?.results ?? []
  for (const result of results) {
    const item = cases('tasks').find(task => task.id === result.id)
    if (item && result.transcript) await regradeTask(result, item, dir)
  }
  if (run.layers.tasks?.scores) {
    const mine = results.filter(result => result.config === 'with-skill')
    run.layers.tasks.scores.passed = mine.filter(result => result.pass).length
    run.layers.tasks.scores.passRate = mine.length ? run.layers.tasks.scores.passed / mine.length : null
    run.layers.tasks.scores.jargon = mine.reduce((sum, result) => sum + (result.conversation?.jargon?.total ?? 0), 0)
    for (const key of Object.keys(run.layers.tasks.scores.judge ?? {})) {
      const values = mine.map(result => result.judge?.scores?.[key]?.score).filter(value => typeof value === 'number')
      run.layers.tasks.scores.judge[key] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
    }
  }
  writeJson(path.join(dir, 'results.json'), run)
  const historyFile = path.join(outRoot, 'history.jsonl')
  const others = fs.existsSync(historyFile) ? fs.readFileSync(historyFile, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : []
  writeReport(dir, run, others.filter(entry => entry.stamp < run.stamp))
  fs.writeFileSync(historyFile, others.map(entry => JSON.stringify(entry.stamp === run.stamp ? summaryLine(run) : entry)).join('\n') + '\n')
  log(`Graded the whole tasks again: ${path.join(dir, 'report.html')}`)
  process.exit()
}

if (options['publish-only']) {
  const dir = path.resolve(options['publish-only'])
  await publish(dir)
  process.exit()
}

const layers = {
  1: { name: 'triggering', label: 'Triggering', run: triggering, file: 'triggering' },
  2: { name: 'choosing', label: 'Choosing', run: choosing, file: 'choosing' },
  3: { name: 'reviewing', label: 'Reviewing', run: reviewing, file: 'reviewing' },
  4: { name: 'tasks', label: 'Whole tasks', run: tasks, file: 'tasks' }
}

// Which layers: those named, or the one a case is in, or 1 to 3, and 4 with --full.
let chosen = options.layer ? options.layer.split(',').map(Number) : options.full ? [1, 2, 3, 4] : [1, 2, 3]
// A case's id names it everywhere, --case too, so no two may share one.
const seenIds = new Map()
for (const layer of Object.values(layers)) {
  for (const item of cases(layer.file)) {
    if (seenIds.has(item.id)) {
      console.error(`Two cases are called ${item.id}, in ${seenIds.get(item.id)}.json and ${layer.file}.json. Rename one.`)
      process.exit(1)
    }
    seenIds.set(item.id, layer.file)
  }
}

// One case, or several with commas between.
const only = options.case ? options.case.split(',').map(id => id.trim()).filter(Boolean) : null
if (only) {
  chosen = Object.entries(layers).filter(([, layer]) => cases(layer.file).some(item => only.includes(item.id))).map(([number]) => Number(number))
  if (!chosen.length) {
    console.error(`There's no case called ${options.case} in evals/cases/.`)
    process.exit(1)
  }
}

if (options.model) useModel(options.model)
const concurrency = Number(options.concurrency ?? 4)
// Once each by default, layer 4 too, so a full run is cheap enough to make
// often. --runs 3 before a big release, to see how much a task varies.
const runsFor = () => Number(options.runs ?? 1)

if (chosen.includes(4)) {
  const selected = cases('tasks').filter(item => !only || only.includes(item.id))
  const configs = options.baseline ? 2 : 1
  const guess = estimate(selected, runsFor(4) * configs)
  const parallel = Math.min(Number(options.concurrency ?? 2), guess.runs)
  log(`Layer 4 runs ${selected.length} case(s) × ${runsFor(4)} run(s)${options.baseline ? ' × 2 (with and without the skill)' : ''}: ${guess.runs} whole tasks.`)
  log(`Roughly ${(guess.tokens / 1e6).toFixed(1)} million tokens, most of them cached (about $${Math.round(guess.tokens / 1e6 * 1.5)} at list prices), and ${Math.round(guess.minutes / parallel)} minutes, ${parallel} at a time.`)
  if (runsFor(4) === 1) log('Each task runs once. Before a big release, run --full --runs 3 to see how much they vary.')
  if (chosen.some(number => number < 4)) log('Layers 1 to 3 add about 4 million tokens (about $6) and 4 minutes.')
  if (!options.yes) {
    const ask = readline.createInterface({ input: process.stdin, output: process.stdout })
    const answer = await ask.question('Go ahead? [y/N] ')
    ask.close()
    if (!/^y(es)?$/i.test(answer.trim())) {
      log('Stopped. Nothing was run.')
      process.exit()
    }
  }
}

// The time it started, to the second, and a number after it if another run
// started in the same second.
const second = new Date().toISOString().replace(/[:.]/g, '-').replace(/-\d+Z$/, 'Z')
fs.mkdirSync(outRoot, { recursive: true })
let stamp = second
for (let n = 2; ; n++) {
  try {
    fs.mkdirSync(path.join(outRoot, stamp))
    break
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    stamp = `${second}-${n}`
  }
}
const out = path.join(outRoot, stamp)
const work = makeWorkDir(stamp)
const started = Date.now()
const commit = runSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: repo }).trim()
const dirty = runSync('git', ['status', '--porcelain', '--', 'src/starter', '.claude/skills', 'evals'], { cwd: repo }).trim() !== ''
log(`Evals ${stamp}, at ${commit}${dirty ? ' with changes' : ''}. Working in ${work}`)

const results = {}
for (const number of chosen) {
  const layer = layers[number]
  const layerStarted = Date.now()
  try {
    const result = await layer.run({
      work, out, only, runs: runsFor(number), baseline: options.baseline,
      concurrency: number === 4 ? Number(options.concurrency ?? 2) : concurrency
    })
    if (result) {
      result.durationMs = Date.now() - layerStarted
      result.usage = (result.results ?? []).reduce((sum, item) => addUsage(addUsage(addUsage(sum, item.usage), item.designerUsage), item.judgeUsage), {})
      results[layer.name] = result
    }
  } catch (error) {
    results[layer.name] = { error: error.stack ?? String(error), durationMs: Date.now() - layerStarted }
    log(`${layer.label} stopped: ${error.message}`)
  }
}

const usage = Object.values(results).reduce((sum, layer) => addUsage(sum, layer.usage), {})
const run = {
  stamp, commit, dirty, model: options.model ?? 'the CLI\'s default', note: options.note ?? null,
  options: { case: options.case ?? null, runs: options.runs ?? null, baseline: Boolean(options.baseline), full: Boolean(options.full) },
  durationMs: Date.now() - started, usage, layers: results
}
writeJson(path.join(out, 'results.json'), run)

// The history, for trends: one line a run, with only the scores.
const historyFile = path.join(outRoot, 'history.jsonl')
const history = fs.existsSync(historyFile) ? fs.readFileSync(historyFile, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : []
const line = summaryLine(run)
writeReport(out, run, history)
fs.appendFileSync(historyFile, `${JSON.stringify(line)}\n`)

log(`\nDone in ${seconds(run.durationMs)}s, ${(usage.total / 1e6).toFixed(2)} million tokens${usage.costUsd ? `, about $${usage.costUsd.toFixed(2)} at list prices` : ''}.`)
for (const [name, layer] of Object.entries(line.layers)) log(`  ${name}: ${JSON.stringify(layer)}`)
log(`Report: ${path.join(out, 'report.html')}`)

if (options.publish) await publish(out)
if (!options.keep) fs.rmSync(work, { recursive: true, force: true })
else log(`Kept the working folders in ${work}`)
