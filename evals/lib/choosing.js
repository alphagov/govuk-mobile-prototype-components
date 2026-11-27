// Layer 2, choosing: given a brief and the catalogue, does the model choose
// what the library's own rules say it should? It may only read files, in a
// copy of catalogue/, and answers in a fixed shape that code grades: what's
// required is there, and what's forbidden isn't, such as a primary button
// for a destructive action.

import fs from 'node:fs'
import path from 'node:path'

import { runOnce } from './claude.js'
import { pack } from './fixtures.js'
import { cases, log, pool, prompt, run as exec } from './util.js'

const schema = {
  type: 'object',
  properties: {
    template: { type: ['string', 'null'], description: 'The template to start from, by its folder name, such as settings, or null' },
    patterns: { type: 'array', items: { type: 'string' }, description: 'Patterns used, by their folder name, such as confirmation' },
    elements: {
      type: 'array',
      description: 'Every library element on the screens, parts too, each with the attributes that matter to the choice',
      items: {
        type: 'object',
        properties: {
          element: { type: 'string' },
          attributes: { type: 'object', additionalProperties: { type: 'string' } }
        },
        required: ['element']
      }
    },
    custom: { type: 'array', items: { type: 'string' }, description: 'Anything not in the library that would have to be made, in words' },
    reasons: { type: 'string' }
  },
  required: ['template', 'patterns', 'elements', 'custom', 'reasons']
}

/**
 * Whether an answer meets one expectation:
 *   template:settings, pattern:confirmation, custom
 *   govuk-app-button                       the element, any attributes
 *   govuk-app-button[variant=destructive]  with that value
 *   govuk-app-button[variant=primary|]     with one of these; empty means left out
 * An array is any one of them.
 */
export function meets(answer, expectation) {
  if (Array.isArray(expectation)) return expectation.some(one => meets(answer, one))
  if (expectation === 'custom') return (answer.custom ?? []).length > 0
  const [kind, name] = expectation.split(':')
  if (kind === 'template') return (answer.template ?? '').toLowerCase() === name
  if (kind === 'pattern') return (answer.patterns ?? []).map(p => p.toLowerCase()).includes(name)
  const match = expectation.match(/^([a-z-]+)(?:\[([a-z-]+)=([^\]]*)\])?$/)
  if (!match) throw new Error(`Can't read the expectation ${expectation}`)
  const [, element, attribute, values] = match
  return (answer.elements ?? []).some(item => {
    if (item.element !== element) return false
    if (!attribute) return true
    const value = item.attributes?.[attribute] ?? ''
    return values.split('|').includes(value)
  })
}

export async function choosing({ work, out, only, runs, concurrency, baseline }) {
  const selected = cases('choosing').filter(item => !only || only.includes(item.id))
  if (!selected.length) return null

  // A copy of the catalogue, from the package, so the model sees only what a
  // prototype's would.
  const tgz = pack(work)
  const unpacked = path.join(work, 'catalogue-package')
  fs.mkdirSync(unpacked, { recursive: true })
  await exec('tar', ['-xzf', tgz, '-C', unpacked])
  const catalogue = path.join(work, 'catalogue')
  fs.cpSync(path.join(unpacked, 'package', 'catalogue'), catalogue, { recursive: true })
  // The baseline has the index alone: what the cards add.
  const indexOnly = path.join(work, 'catalogue-index-only')
  fs.mkdirSync(indexOnly, { recursive: true })
  fs.copyFileSync(path.join(catalogue, 'index.md'), path.join(indexOnly, 'index.md'))

  const transcripts = path.join(out, 'transcripts', 'choosing')
  fs.mkdirSync(transcripts, { recursive: true })
  const configs = baseline ? ['with-cards', 'index-only'] : ['with-cards']
  const jobs = selected.flatMap(item => configs.flatMap(config => Array.from({ length: runs }, (_, i) => ({ item, config, n: i + 1 }))))
  log(`Layer 2, choosing: ${jobs.length} runs`)

  const results = await pool(jobs, concurrency, async ({ item, config, n }) => {
    const cwd = config === 'with-cards' ? catalogue : indexOnly
    const transcript = path.join(transcripts, `${item.id}-${config}-${n}.jsonl`)
    const run = await runOnce({
      cwd,
      prompt: prompt('choosing', { brief: item.brief }),
      args: ['--tools', 'Read', '--permission-mode', 'dontAsk', '--allowedTools', 'Read', '--json-schema', JSON.stringify(schema), '--max-turns', '40'],
      transcript,
      timeoutMs: 6 * 60_000
    })
    const answer = run.structured
    const failures = []
    if (!answer) failures.push(run.error ? `no answer: ${run.error}` : 'no answer in the fixed shape')
    else {
      for (const expectation of item.require ?? []) {
        if (!meets(answer, expectation)) failures.push(`missing ${[].concat(expectation).join(' or ')}`)
      }
      for (const expectation of item.forbid ?? []) {
        if (meets(answer, expectation)) failures.push(`chose ${[].concat(expectation).join(' or ')}, which it shouldn't`)
      }
    }
    // What it read, and how much: the cost of choosing.
    const real = fs.realpathSync(cwd)
    const read = run.toolUses.filter(tool => tool.name === 'Read').map(tool => {
      const file = path.resolve(cwd, tool.input.file_path ?? '')
      return path.relative(file.startsWith(real) ? real : cwd, file)
    })
    const bytesRead = read.reduce((sum, file) => {
      try {
        return sum + fs.statSync(path.join(cwd, file)).size
      } catch {
        return sum
      }
    }, 0)
    process.stdout.write(failures.length ? 'x' : '.')
    return {
      id: item.id, config, n, brief: item.brief, pass: !failures.length, failures, answer,
      read, bytesRead, usage: run.usage, durationMs: run.durationMs, transcript: path.relative(out, transcript)
    }
  })
  process.stdout.write('\n')

  const summarise = config => {
    const mine = results.filter(result => result.config === config)
    const passed = mine.filter(result => result.pass).length
    return {
      passRate: mine.length ? passed / mine.length : null, passed, total: mine.length,
      meanFilesRead: mine.length ? mine.reduce((sum, result) => sum + result.read.length, 0) / mine.length : null,
      meanBytesRead: mine.length ? mine.reduce((sum, result) => sum + result.bytesRead, 0) / mine.length : null
    }
  }
  return { results, scores: summarise('with-cards'), baseline: baseline ? summarise('index-only') : null }
}
