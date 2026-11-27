// Layer 1, triggering: does a designer's message start the right skill, or
// none? Each message is sent to claude -p in a fixture, a prototype or the
// library, and the run is stopped as soon as it's known which skill it
// reached for: a Skill tool call, or reading a skill's SKILL.md.

import fs from 'node:fs'
import path from 'node:path'

import { runOnce } from './claude.js'
import { cloneLibrary, prototype } from './fixtures.js'
import { cases, log, pool } from './util.js'

// Enough to look around first, such as reading prototype.json, and then
// reach for a skill. A run that hasn't by then wouldn't have.
const maxToolCalls = 8

// It may look but not change anything, and nothing asks: whatever isn't
// allowed is refused, and it carries on.
const args = [
  '--max-turns', String(maxToolCalls),
  '--permission-mode', 'dontAsk',
  '--allowedTools', 'Read', 'Glob', 'Grep', 'Skill', 'Bash(ls *)', 'Bash(cat *)', 'Bash(node library.js*)'
]

// prototype-setup says to use it at the start of every session, so it may
// come before the skill a message is for. That's allowed, and not counted
// for or against it.
const prelude = 'prototype-setup'

/** The skill a tool call reaches for, if any. */
export function skillOf(tool) {
  const pattern = /\.claude\/skills\/([^/\s]+)\/SKILL\.md/
  if (tool.name === 'Skill') return String(tool.input?.skill ?? '').replace(/^.*:/, '').replace(/^\//, '') || null
  if (tool.name === 'Read') return String(tool.input?.file_path ?? '').match(pattern)?.[1] ?? null
  if (tool.name === 'Bash') return String(tool.input?.command ?? '').match(pattern)?.[1] ?? null
  return null
}

export async function triggering({ work, out, only, runs, concurrency }) {
  const all = cases('triggering')
  const selected = all.filter(item => !only || only.includes(item.id))
  if (!selected.length) return null

  const fixtures = {}
  if (selected.some(item => item.fixture === 'prototype')) fixtures.prototype = prototype(work)
  if (selected.some(item => item.fixture === 'library')) fixtures.library = cloneLibrary(work, 'triggering-library')
  const has = (fixture, skill) => fs.existsSync(path.join(fixtures[fixture], '.claude', 'skills', skill, 'SKILL.md'))

  const transcripts = path.join(out, 'transcripts', 'triggering')
  fs.mkdirSync(transcripts, { recursive: true })

  const jobs = []
  for (const item of selected) {
    if (item.expect && !has(item.fixture, item.expect)) continue
    for (let n = 1; n <= runs; n++) jobs.push({ item, n })
  }
  log(`Layer 1, triggering: ${jobs.length} runs`)

  const results = await pool(jobs, concurrency, async ({ item, n }) => {
    const skills = []
    const transcript = path.join(transcripts, `${item.id}-${n}.jsonl`)
    let toolCalls = 0
    const run = await runOnce({
      cwd: fixtures[item.fixture],
      prompt: item.prompt,
      args,
      transcript,
      timeoutMs: 4 * 60_000,
      onEvent(event, stop) {
        if (event.type !== 'assistant') return
        for (const block of event.message?.content ?? []) {
          if (block.type !== 'tool_use') continue
          toolCalls++
          const skill = skillOf(block)
          if (skill && !skills.includes(skill)) skills.push(skill)
          if (skill && (skill === item.expect || skill !== prelude)) return stop('known')
          if (toolCalls >= maxToolCalls) return stop('enough')
        }
      }
    })
    const others = skills.filter(skill => skill !== item.expect && !(skill === prelude && skills.includes(item.expect)))
    const pass = item.expect ? skills.includes(item.expect) && !others.length : !skills.length
    const reason = pass ? '' : item.expect
      ? (skills.length ? `used ${skills.join(', then ')}` : 'used no skill')
      : `used ${skills.join(', then ')}, expected none`
    process.stdout.write(pass ? '.' : 'x')
    return {
      id: item.id, n, prompt: item.prompt, fixture: item.fixture, expect: item.expect ?? null,
      skills, pass, reason, error: run.error, usage: run.usage, durationMs: run.durationMs,
      transcript: path.relative(out, transcript)
    }
  })
  process.stdout.write('\n')

  const pending = selected.filter(item => item.expect && !has(item.fixture, item.expect))
    .map(item => ({ id: item.id, prompt: item.prompt, expect: item.expect, why: `no ${item.expect} skill in the ${item.fixture} yet` }))

  return { results, pending, scores: score(results) }
}

/** Precision and recall for each skill, and the share of runs that did the right thing. */
export function score(results) {
  const skills = [...new Set(results.flatMap(result => [result.expect, ...result.skills]).filter(Boolean))].sort()
  const perSkill = {}
  for (const skill of skills) {
    let tp = 0, fp = 0, fn = 0
    for (const result of results) {
      const used = result.skills.includes(skill)
      const asPrelude = skill === prelude && result.expect && result.expect !== prelude && result.skills.includes(result.expect)
      if (result.expect === skill) used ? tp++ : fn++
      else if (used && !asPrelude) fp++
    }
    perSkill[skill] = {
      tp, fp, fn,
      precision: tp + fp ? tp / (tp + fp) : null,
      recall: tp + fn ? tp / (tp + fn) : null
    }
  }
  const passed = results.filter(result => result.pass).length
  return { passRate: results.length ? passed / results.length : null, passed, total: results.length, perSkill }
}
