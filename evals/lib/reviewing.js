// Layer 3, reviewing: plant faults in copies of real components, in a
// throwaway clone of the library, leave them as uncommitted changes, and ask
// for a review, as someone would. Graded on the faults its report names
// (the file, and words for the rule) and on false alarms: must or should
// fixes for a clean change. The rule checker, check.js, is run alone on the
// same change, for comparison.

import fs from 'node:fs'
import path from 'node:path'

import { runOnce } from './claude.js'
import { cloneLibrary } from './fixtures.js'
import { cases, log, pool, repo, run as exec, runSync } from './util.js'

const args = [
  '--max-turns', '80',
  '--permission-mode', 'dontAsk',
  '--allowedTools', 'Read', 'Glob', 'Grep', 'Skill', 'Bash(npm *)', 'Bash(node *)', 'Bash(npx *)', 'Bash(git *)', 'Bash(ls *)', 'Bash(cat *)', 'Bash(head *)', 'Bash(sed -n *)', 'Bash(grep *)', 'Bash(find *)',
  // A review doesn't change anything until asked, and never leaves the clone.
  '--disallowedTools', 'Edit', 'Write', 'NotebookEdit', 'Bash(git push*)', 'Bash(gh *)', 'WebFetch', 'WebSearch'
]

/** Applies a case's edits to the clone, as changes not yet committed. */
export function plant(dir, edits) {
  for (const edit of edits) {
    const file = path.join(dir, edit.file)
    const text = fs.readFileSync(file, 'utf8')
    if (edit.append) {
      fs.writeFileSync(file, text + edit.append)
      continue
    }
    const count = text.split(edit.find).length - 1
    if (count !== 1) throw new Error(`${edit.file}: expected the text to change once, found it ${count} times: ${edit.find.slice(0, 60)}`)
    fs.writeFileSync(file, text.replace(edit.find, () => edit.replace))
  }
}

/**
 * A review's findings, from its report: each starts with a bold file name,
 * as **src/components/x/x.css:12**, under a Must fix, Should fix or Worth a
 * look heading.
 */
export function findingsOf(report) {
  const findings = []
  let level = null
  let current = null
  for (const line of report.split('\n')) {
    const heading = line.match(/^\s*(?:#+\s*|\*\*)?\s*(must fix|should fix|worth a look)/i)
    if (heading && !/\.(css|js|json|html|md)\b/.test(line)) {
      level = { 'must fix': 'must', 'should fix': 'should', 'worth a look': 'look' }[heading[1].toLowerCase()]
      current = null
      continue
    }
    const header = line.match(/^\s*(?:[-*]\s+|\d+\.\s+)?\*\*`?([^*`\n]+?\.(?:css|js|json|html|md))(?::[\d-]+)?`?(?:\*\*|:)/)
    if (header) {
      current = { level: level ?? 'unknown', file: header[1], text: line }
      findings.push(current)
    } else if (current) {
      if (/^#+\s/.test(line)) current = null
      else current.text += `\n${line}`
    }
  }
  return findings
}

/** check.js's findings, from its output. */
export function checkerFindings(output) {
  const findings = []
  let level = null
  const lines = output.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^(Must fix|Should fix|Worth a look) \(/)
    if (heading) {
      level = { 'Must fix': 'must', 'Should fix': 'should', 'Worth a look': 'look' }[heading[1]]
      continue
    }
    const header = lines[i].match(/^ {2}(\S+?)(?::\d+)?$/)
    if (header && level) findings.push({ level, file: header[1], text: `${lines[i]}\n${lines[i + 1] ?? ''}` })
  }
  return findings
}

/** Which planted faults the findings name, and which must or should fixes name none. */
export function grade(faults, findings) {
  const found = faults.map(fault => {
    const pattern = new RegExp(fault.match, 'i')
    const hit = findings.find(finding => path.basename(finding.file) === fault.file && pattern.test(finding.text))
    return { ...fault, found: Boolean(hit), level: hit?.level ?? null }
  })
  const others = findings.filter(finding => finding.level === 'must' || finding.level === 'should')
    .filter(finding => !faults.some(fault => path.basename(finding.file) === fault.file && new RegExp(fault.match, 'i').test(finding.text)))
  return { found, others }
}

export async function reviewing({ work, out, only, runs, concurrency, baseline }) {
  const selected = cases('reviewing').filter(item => !only || only.includes(item.id))
  if (!selected.length) return null
  const transcripts = path.join(out, 'transcripts', 'reviewing')
  fs.mkdirSync(transcripts, { recursive: true })
  const configs = baseline ? ['with-skill', 'without-skill'] : ['with-skill']
  const jobs = selected.flatMap(item => configs.flatMap(config => Array.from({ length: runs }, (_, i) => ({ item, config, n: i + 1 }))))
  log(`Layer 3, reviewing: ${jobs.length} runs, and check.js on each case`)

  const results = await pool(jobs, concurrency, async ({ item, config, n }) => {
    const name = `review-${item.id}-${config}-${n}`
    const dir = cloneLibrary(work, name)
    if (config === 'without-skill') withoutReviewSkill(dir)
    plant(dir, item.edits)

    // check.js alone, on the same change: this working tree's, as the
    // baseline's clone hasn't one.
    const checker = await exec(process.execPath, [path.join(repo, '.claude/skills/library-review/scripts/check.js'), '--base', 'origin/main'], { cwd: dir })
    const checkerGrade = grade(item.faults, checkerFindings(checker.stdout))

    const transcript = path.join(transcripts, `${item.id}-${config}-${n}.jsonl`)
    const run = await runOnce({ cwd: dir, prompt: item.prompt, args, transcript, timeoutMs: 25 * 60_000 })
    const report = run.text ?? ''
    fs.writeFileSync(path.join(transcripts, `${item.id}-${config}-${n}.report.md`), report)
    const findings = findingsOf(report)
    const { found, others } = grade(item.faults, findings)
    const usedSkill = run.toolUses.some(tool => tool.name === 'Skill' && /library-review/.test(tool.input?.skill ?? '')) ||
      run.toolUses.some(tool => /library-review\/SKILL\.md/.test(JSON.stringify(tool.input ?? {})))
    const pass = item.clean ? !others.length : found.every(fault => fault.found)
    process.stdout.write(pass ? '.' : 'x')
    return {
      id: item.id, config, n, clean: Boolean(item.clean), pass, usedSkill,
      faults: found, falseAlarms: item.clean ? others : [], otherFindings: item.clean ? [] : others,
      findings: findings.length, parsed: findings.length > 0,
      checker: { faults: checkerGrade.found, others: checkerGrade.others },
      error: run.error, usage: run.usage, durationMs: run.durationMs,
      transcript: path.relative(out, transcript),
      report: path.relative(out, path.join(transcripts, `${item.id}-${config}-${n}.report.md`))
    }
  })
  process.stdout.write('\n')

  const summarise = (config, pick) => {
    const mine = results.filter(result => result.config === config)
    const planted = mine.flatMap(result => pick(result).faults)
    const clean = mine.filter(result => result.clean)
    const falseAlarms = clean.reduce((sum, result) => sum + pick(result).falseAlarms, 0)
    return {
      recall: planted.length ? planted.filter(fault => fault.found).length / planted.length : null,
      found: planted.filter(fault => fault.found).length,
      planted: planted.length,
      falseAlarms,
      cleanRuns: clean.length,
      cleanPassRate: clean.length ? clean.filter(result => pick(result).falseAlarms === 0).length / clean.length : null,
      passRate: mine.length ? mine.filter(result => result.pass).length / mine.length : null
    }
  }
  const skill = result => ({ faults: result.faults, falseAlarms: result.falseAlarms.length })
  const checkerOnly = result => ({ faults: result.checker.faults, falseAlarms: result.clean ? result.checker.others.length : 0 })
  return {
    results,
    scores: summarise('with-skill', skill),
    checker: summarise('with-skill', checkerOnly),
    baseline: baseline ? summarise('without-skill', skill) : null
  }
}

/**
 * The baseline: the same clone without the review skill, taken out in a
 * commit of its own, with an origin of its own that has that commit, so the
 * review sees only the case's change.
 */
function withoutReviewSkill(dir) {
  fs.rmSync(path.join(dir, '.claude', 'skills', 'library-review'), { recursive: true, force: true })
  runSync('git', ['add', '--all'], { cwd: dir })
  runSync('git', ['commit', '--quiet', '-m', 'Take out the review skill, for the baseline'], { cwd: dir })
  const origin = `${dir}-origin.git`
  runSync('git', ['clone', '--quiet', '--bare', dir, origin])
  runSync('git', ['remote', 'set-url', 'origin', origin], { cwd: dir })
  runSync('git', ['fetch', '--quiet', 'origin'], { cwd: dir })
}
