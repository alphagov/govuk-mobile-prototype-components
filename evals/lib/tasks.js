// Layer 4, whole tasks: a skill does a whole job, from a designer's first
// message to handing it over, in a fresh folder of its own. A simulated
// designer, another claude with a persona and the brief, answers its
// questions. Then it's graded three ways:
//
//   Code checks          what was made works: see prototype-checks.js, or,
//                        for the library, the build and the rule checker
//   A screenshot judge   another claude scores the screens, 1 to 5: trend
//                        data, not pass or fail
//   Conversation checks  from the transcript: one question at a time, a plan
//                        agreed before building, consent before installing,
//                        no jargon

import fs from 'node:fs'
import path from 'node:path'

import { addUsage, runOnce, startSession } from './claude.js'
import { cloneLibrary, copyPrototype, prototype, referenceScreens } from './fixtures.js'
import { checkPrototype } from './prototype-checks.js'
import { cases, log, pool, prompt, repo, run as exec, walk } from './util.js'

// Commands a session may run without asking, confined to its own folder.
// Anything else is refused, not asked about, as no one is there to answer.
const common = [
  'Read', 'Glob', 'Grep', 'Skill', 'Edit', 'Write', 'TodoWrite',
  'Bash(npm *)', 'Bash(node *)', 'Bash(npx *)', 'Bash(ls *)', 'Bash(cat *)', 'Bash(head *)', 'Bash(tail *)', 'Bash(grep *)',
  'Bash(mkdir *)', 'Bash(cp *)', 'Bash(mv *)', 'Bash(test *)', 'Bash(sleep *)', 'Bash(curl -s http://localhost*)', 'Bash(export PATH*)',
  'Bash(git add*)', 'Bash(git commit*)', 'Bash(git status*)', 'Bash(git log*)', 'Bash(git diff*)'
]
const never = ['Bash(git push*)', 'Bash(gh pr*)', 'Bash(gh repo*)', 'Bash(open *)', 'Bash(rm -rf /*)', 'Bash(sudo *)', 'WebSearch']

const jargon = ['npm', 'git', 'commit', 'repo', 'branch', 'CLI', 'terminal', 'JSON', 'node_modules']

export function estimate(selected, runs) {
  const minutes = selected.reduce((sum, item) => sum + (item.estimate?.minutes ?? 10), 0) * runs
  const tokens = selected.reduce((sum, item) => sum + (item.estimate?.tokens ?? 2_000_000), 0) * runs
  return { runs: selected.length * runs, minutes, tokens }
}

export async function tasks({ work, out, only, runs, concurrency, baseline }) {
  const selected = cases('tasks').filter(item => !only || only.includes(item.id))
  if (!selected.length) return null
  const configs = baseline ? ['with-skill', 'without-skill'] : ['with-skill']
  const jobs = selected.flatMap(item => configs.flatMap(config => Array.from({ length: runs }, (_, i) => ({ item, config, n: i + 1 }))))
  log(`Layer 4, whole tasks: ${jobs.length} runs`)
  if (selected.some(item => item.kind === 'prototype')) {
    prototype(work)
    await referenceScreens(work)
  }

  const results = await pool(jobs, concurrency, async job => {
    const result = await runTask(work, out, job).catch(error => ({ id: job.item.id, config: job.config, n: job.n, error: error.stack ?? String(error), checks: [], pass: false }))
    log(`  ${result.id} (${result.config}, run ${result.n}): ${result.pass ? 'passed' : 'failed'}${result.error ? `, ${String(result.error).split('\n')[0]}` : ''}`)
    return result
  })

  const summarise = config => {
    const mine = results.filter(result => result.config === config)
    const judged = mine.filter(result => result.judge?.scores)
    const mean = key => {
      const values = judged.map(result => result.judge.scores[key]?.score).filter(value => typeof value === 'number')
      return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
    }
    return {
      passRate: mine.length ? mine.filter(result => result.pass).length / mine.length : null,
      passed: mine.filter(result => result.pass).length,
      total: mine.length,
      judge: { looksLikeApp: mean('looksLikeApp'), hierarchy: mean('hierarchy'), darkMode: mean('darkMode'), matchesDesign: mean('matchesDesign') },
      jargon: mine.reduce((sum, result) => sum + (result.conversation?.jargon?.total ?? 0), 0)
    }
  }
  return { results, scores: summarise('with-skill'), baseline: baseline ? summarise('without-skill') : null }
}

async function runTask(work, out, { item, config, n }) {
  const name = `task-${item.id}-${config}-${n}`
  const runOut = path.join(out, 'tasks', `${item.id}-${config}-${n}`)
  fs.mkdirSync(runOut, { recursive: true })
  const transcript = path.join(runOut, 'transcript.jsonl')

  let dir
  let args
  if (item.kind === 'library') {
    dir = cloneLibrary(work, name)
    if (config === 'without-skill') fs.rmSync(path.join(dir, '.claude', 'skills', item.skill), { recursive: true, force: true })
    args = [
      '--permission-mode', 'acceptEdits', '--permission-prompts', 'none', '--max-turns', '150',
      // Its own copy, and the folder around it, where the skill may put a worktree.
      '--add-dir', path.dirname(dir),
      '--allowedTools', ...common, 'Bash(git *)', 'Bash(gh search*)', 'Bash(gh api*)', 'Bash(gh auth status*)', 'WebFetch',
      '--disallowedTools', ...never
    ]
  } else {
    dir = copyPrototype(work, name)
    if (config === 'without-skill') fs.rmSync(path.join(dir, '.claude', 'skills'), { recursive: true, force: true })
    if (item.design) fs.copyFileSync(path.join(repo, item.design), path.join(dir, item.designName ?? path.basename(item.design)))
    args = [
      '--permission-mode', 'acceptEdits', '--permission-prompts', 'none', '--max-turns', '150',
      '--allowedTools', ...common,
      '--disallowedTools', ...never, 'WebFetch'
    ]
  }
  const before = item.kind === 'prototype' ? snapshot(dir) : null

  // Stops the session where it would push or open a pull request: the end
  // of a library task, as far as these evals go.
  let delivered = false
  const session = startSession({
    cwd: dir, args, transcript,
    onEvent(event, stop) {
      if (event.type !== 'assistant') return
      for (const block of event.message?.content ?? []) {
        if (block.type === 'tool_use' && block.name === 'Bash' && /\bgit push\b|\bgh pr create\b/.test(block.input?.command ?? '')) {
          delivered = true
          stop('delivery')
        }
      }
    }
  })

  const conversation = []
  let designerUsage = {}
  let message = item.opening
  let turnCount = 0
  let endedBy = 'turn limit'
  while (turnCount < item.maxTurns) {
    conversation.push({ role: 'designer', text: message })
    const turn = await session.send(message)
    turnCount++
    conversation.push({ role: 'claude', text: turn.text, tools: turn.toolUses.map(tool => tool.name) })
    if (session.stopped) {
      endedBy = delivered ? 'reached push or pull request' : `stopped: ${session.stopped}`
      break
    }
    if (turn.ended) {
      endedBy = 'the session ended'
      break
    }
    // Outside this repository, so the designer reads none of its CLAUDE.md.
    const designerDir = path.join(work, 'designer')
    fs.mkdirSync(designerDir, { recursive: true })
    const reply = await runOnce({
      cwd: designerDir,
      prompt: prompt('designer', { brief: item.brief, conversation: render(conversation) }),
      args: ['--tools', '', '--max-turns', '3', '--json-schema', JSON.stringify({ type: 'object', properties: { reply: { type: 'string' }, done: { type: 'boolean' } }, required: ['reply', 'done'] })],
      timeoutMs: 3 * 60_000
    })
    designerUsage = addUsage(designerUsage, reply.usage)
    if (!reply.structured || reply.structured.done) {
      endedBy = reply.structured ? 'handed over' : 'the designer had no reply'
      break
    }
    message = reply.structured.reply
  }
  const closed = await session.close()
  fs.writeFileSync(path.join(runOut, 'conversation.json'), JSON.stringify(conversation, null, 2))

  const checks = item.kind === 'library'
    ? await checkLibrary(dir, item, delivered)
    : await checkPrototype(dir, item.checks).catch(error => [{ name: 'Code checks ran', pass: false, problems: [error.message] }])

  let judge = null
  let screens = []
  let pages = []
  if (item.kind === 'prototype') {
    pages = changedPages(dir, before)
    screens = await screenshot(dir, pages, runOut)
    judge = screens.length ? await judgeScreens(work, runOut, item, screens) : null
    if (judge?.references) judge.references = judge.references.map(file => path.relative(out, file))
  }

  const talk = conversationChecks(session.turns, item)
  const pass = checks.every(check => check.pass)
  return {
    id: item.id, title: item.title, config, n, kind: item.kind, pass, endedBy,
    turns: turnCount, checks, conversation: talk, judge,
    pages,
    screens: screens.map(file => path.relative(out, file)),
    excerpt: conversation.slice(0, 8).map(entry => ({ role: entry.role, text: entry.text.slice(0, 1200) })),
    usage: closed.usage, designerUsage, judgeUsage: judge?.usage ?? {},
    durationMs: closed.durationMs,
    transcript: path.relative(out, transcript),
    folder: dir
  }
}

function render(conversation) {
  return conversation.map(entry => `${entry.role === 'claude' ? 'Claude' : 'You'}: ${entry.text || '(working, said nothing)'}`).join('\n\n')
}

/** Every page in screens/, with its text, to tell later which changed. */
function snapshot(dir) {
  return new Map(walk(path.join(dir, 'screens'), file => file.endsWith('.html')).map(file => [file, fs.readFileSync(path.join(dir, 'screens', file), 'utf8')]))
}

/** The pages a task made or changed, in the order prototype.json lists them: the journey's. */
function changedPages(dir, before) {
  const after = snapshot(dir)
  const changed = [...after].filter(([file, text]) => before.get(file) !== text).map(([file]) => `/screens/${file}`)
  let order = []
  try {
    order = JSON.parse(fs.readFileSync(path.join(dir, 'prototype.json'), 'utf8')).screens.map(screen => screen.path)
  } catch {}
  const rank = page => (order.includes(page) ? order.indexOf(page) : order.length)
  return changed.sort((a, b) => rank(a) - rank(b))
}

/** Screenshots of the pages a task made or changed, with the prototype's own script, copied into the report. */
async function screenshot(dir, pages, runOut) {
  if (!pages.length) return []
  // At most eight screens, to keep the judge's reading down.
  const chosen = pages.slice(0, 8)
  await exec('npm', ['run', 'screenshots', '--silent', '--', ...chosen], { cwd: dir, timeoutMs: 5 * 60_000 })
  const shots = path.join(dir, '.screenshots')
  const target = path.join(runOut, 'screens')
  fs.mkdirSync(target, { recursive: true })
  const names = chosen.map(page => page.replace(/^\/(screens\/)?|\.html$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''))
  const files = []
  const available = fs.existsSync(shots) ? fs.readdirSync(shots).sort() : []
  for (const name of names) {
    for (const file of available.filter(file => new RegExp(`^${name}-(light|dark)(-end)?\\.png$`).test(file))) {
      fs.copyFileSync(path.join(shots, file), path.join(target, file))
      files.push(path.join(target, file))
    }
  }
  return files
}

async function judgeScreens(work, runOut, item, screens) {
  // A folder of its own, outside this repository, with copies of everything
  // it reads.
  const dir = path.join(work, 'judge', path.basename(runOut))
  fs.mkdirSync(path.join(dir, 'references'), { recursive: true })
  fs.mkdirSync(path.join(dir, 'made'), { recursive: true })
  screens = screens.map(file => {
    const copy = path.join(dir, 'made', path.basename(file))
    fs.copyFileSync(file, copy)
    return copy
  })
  // The app's own screens, as the library's templates draw them: one of each
  // tab, and the sign-out confirmation, the Confirmation pattern in use. Not
  // the end of a long screen, which adds little.
  const references = (await referenceScreens(work)).filter(file => /^(settings-index|home-index|chat-index|settings-sign-out)-(light|dark)\.png$/.test(path.basename(file)))
  // Kept with the run, for the report and the docs site to show.
  const kept = path.join(runOut, 'references')
  fs.mkdirSync(kept, { recursive: true })
  for (const file of references) fs.copyFileSync(file, path.join(kept, path.basename(file)))
  for (const file of references) fs.copyFileSync(file, path.join(dir, 'references', path.basename(file)))
  let design = ''
  if (item.design) {
    fs.copyFileSync(path.join(repo, item.design), path.join(dir, item.designName ?? path.basename(item.design)))
    design = `The design that was given, to compare with: ${item.designName ?? path.basename(item.design)}`
  }
  const score = { type: 'object', properties: { score: { type: ['integer', 'null'] }, reason: { type: 'string' } }, required: ['score', 'reason'] }
  const schema = { type: 'object', properties: { looksLikeApp: score, hierarchy: score, darkMode: score, matchesDesign: score }, required: ['looksLikeApp', 'hierarchy', 'darkMode', 'matchesDesign'] }
  const run = await runOnce({
    cwd: dir,
    prompt: prompt('judge', {
      brief: item.brief,
      made: screens.map(file => `- ${path.relative(dir, file)}`).join('\n'),
      references: references.map(file => `- references/${path.basename(file)}`).join('\n'),
      design
    }),
    args: ['--tools', 'Read', '--permission-mode', 'dontAsk', '--allowedTools', 'Read', '--max-turns', '40', '--json-schema', JSON.stringify(schema)],
    transcript: path.join(runOut, 'judge.jsonl'),
    timeoutMs: 10 * 60_000
  })
  return { scores: withoutDesign(run.structured, item), usage: run.usage, error: run.error, references: references.map(file => path.join(kept, path.basename(file))) }
}

/** With no design to match, a judge's score for matching one means nothing. */
function withoutDesign(scores, item) {
  if (!scores || item.design) return scores
  return { ...scores, matchesDesign: { score: null, reason: 'No design given' } }
}

/** What a library task left: a new component, built and checked, committed on a branch of its own, not pushed. */
async function checkLibrary(dir, item, delivered) {
  const checks = []
  const add = (name, problems, detail = '') => checks.push({ name, pass: !problems.length, problems, detail })
  // The work may be in the clone, or a worktree the skill made beside it.
  const candidates = [dir, ...fs.readdirSync(path.dirname(dir)).map(entry => path.join(path.dirname(dir), entry)).filter(entry => entry !== dir && fs.existsSync(path.join(entry, '.git')))]
  let where = null
  let folder = null
  for (const candidate of candidates) {
    const changed = await exec('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: candidate })
    const untracked = await exec('git', ['ls-files', '--others', '--exclude-standard'], { cwd: candidate })
    const names = `${changed.stdout}\n${untracked.stdout}`.split('\n').map(file => file.match(/^src\/components\/([^/]+)\//)?.[1]).filter(Boolean)
    const fresh = names.find(slug => slug.includes(item.checks.component)) ?? names[0]
    if (fresh) {
      where = candidate
      folder = fresh
      break
    }
  }
  if (!where) {
    add('A new component was made', ['no new folder in src/components/'])
    return checks
  }
  const files = ['html', 'css', 'js', 'json'].filter(ext => !fs.existsSync(path.join(where, 'src', 'components', folder, `${folder}.${ext}`)))
  add('A new component was made', files.map(ext => `no ${folder}.${ext}`), `src/components/${folder}/`)
  if (!fs.existsSync(path.join(where, 'node_modules'))) fs.symlinkSync(path.join(repo, 'node_modules'), path.join(where, 'node_modules'))
  const build = await exec('npm', ['run', 'build', '--silent'], { cwd: where, timeoutMs: 5 * 60_000 })
  add('npm run build passes', build.code === 0 ? [] : [(build.stderr || build.stdout).trim().split('\n').slice(-4).join(' ')])
  const checker = await exec(process.execPath, [path.join(repo, '.claude/skills/library-review/scripts/check.js'), '--base', 'origin/main'], { cwd: where })
  const must = checker.stdout.match(/Must fix \((\d+)\)/)?.[1]
  add('The rule checker finds no must-fixes', must ? [`${must} must-fix finding(s)`] : [])
  const branch = (await exec('git', ['branch', '--show-current'], { cwd: where })).stdout.trim()
  const log = (await exec('git', ['log', '--format=%s%n%b%x00', 'origin/main..HEAD'], { cwd: where })).stdout.split('\0').map(entry => entry.trim()).filter(Boolean)
  const commitProblems = []
  if (!branch || branch === 'main') commitProblems.push(`the work is on ${branch || 'no branch'}, not a branch of its own`)
  if (!log.length) commitProblems.push('nothing committed')
  for (const entry of log) {
    const [subject, ...body] = entry.split('\n')
    if (/^(Added|Adds|Adding)\b/.test(subject)) commitProblems.push(`"${subject}" isn't imperative`)
    if (!body.join('').trim()) commitProblems.push(`"${subject}" has no body saying why`)
  }
  add('Committed on a branch, with good messages', commitProblems, branch)
  checks.push({ name: 'Got as far as sending it for review', pass: delivered, problems: delivered ? [] : ['stopped before pushing or opening a pull request'], detail: 'stopped as it tried to push', trend: true })
  return checks.filter(check => !check.trend).concat(checks.filter(check => check.trend).map(check => ({ ...check, pass: true, note: check.pass ? 'yes' : 'no' })))
}

/** Checks on the conversation, from what the user saw. */
export function conversationChecks(turns, item) {
  const visible = turns.map(turn => (turn.text ?? '').replace(/```[\s\S]*?```/g, ''))
  // A question is a sentence ending in ?, in prose: not in code, a list, a
  // heading, bold or quotes, where a plan names a screen by its question,
  // such as **What's your postcode?**.
  const prose = text => text.split('\n')
    .filter(line => !/^\s*(\d+\.|[-*>]|#)/.test(line))
    .join('\n')
    .replace(/`[^`]*`|\*\*[^*]*\*\*|“[^”]*”|"[^"]*"/g, '')
  const questions = visible.map(text => (prose(text).match(/[^.!?\n]+\?/g) ?? []).length)
  const manyQuestions = questions.map((count, index) => ({ turn: index + 1, count })).filter(entry => entry.count > 1)

  // Where it first wrote a screen or component.
  const builds = turns.findIndex(turn => turn.toolUses.some(tool => ['Write', 'Edit'].includes(tool.name) && /\/(screens|components|src)\//.test(tool.input?.file_path ?? '')))
  // A plan is a list of two or more steps, quoted or not, shown in a turn
  // that ends before building starts, so the designer has answered it.
  const planned = turns.findIndex(turn => (turn.text.match(/^\s*(>\s*)*(\d+\.|-)\s+\S/gm) ?? []).length >= 2)
  let plan
  if (!item.plan) plan = { pass: true, note: 'not needed for a small change' }
  else if (builds < 0) plan = { pass: true, note: 'nothing built' }
  else plan = { pass: planned >= 0 && planned < builds, note: planned >= 0 ? `plan in turn ${planned + 1}, building from turn ${builds + 1}` : `building from turn ${builds + 1}, with no plan before it` }

  // Installing something on the computer, outside the folder: Node.js, or a
  // browser to take screenshots with. Allowed after a turn that asked. Not
  // npm install of a folder's own parts, which the skills do as they go.
  const install = /--install-browser|install-node\.sh|nodejs\.org\/dist|playwright install|brew install|npm (install|i) (-g|--global)\b/
  const installs = []
  turns.forEach((turn, index) => {
    for (const tool of turn.toolUses) {
      if (tool.name === 'Bash' && install.test(tool.input?.command ?? '')) installs.push(index)
    }
  })
  const asked = index => turns.slice(0, index).some(turn => /\?/.test(turn.text) && /download|install/i.test(turn.text))
  const unasked = installs.filter(index => !asked(index))
  const consent = installs.length
    ? { pass: !unasked.length, note: unasked.length ? `installed without asking, in turn ${unasked[0] + 1}` : `asked before ${installs.length} install(s)` }
    : { pass: true, note: 'nothing installed' }

  const counts = {}
  for (const word of jargon) {
    // A word on its own, not part of a path, a file name or a longer word.
    // CLI and JSON only in capitals, as they're written in prose.
    const pattern = new RegExp(`(^|[^\\w/.-])${word}(?![\\w])`, word === 'CLI' || word === 'JSON' ? 'g' : 'gi')
    const found = visible.reduce((sum, text) => sum + (text.match(pattern) ?? []).length, 0)
    if (found) counts[word] = found
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return {
    oneQuestion: { pass: !manyQuestions.length, note: manyQuestions.length ? manyQuestions.map(entry => `turn ${entry.turn}: ${entry.count} questions`).join(', ') : `${turns.length} turns, at most one question each` },
    plan,
    consent,
    jargon: { pass: total === 0, total, counts, note: total ? Object.entries(counts).map(([word, count]) => `${word} ×${count}`).join(', ') : 'none' }
  }
}

/**
 * Grades a finished task again, after the checks change, without running it
 * again: the conversation from its transcript, and, if its folder was kept
 * (--keep), the code checks on what it made.
 */
export async function regradeTask(result, item, out) {
  if (result.judge?.scores) result.judge.scores = withoutDesign(result.judge.scores, item)
  result.conversation = conversationChecks(turnsFromTranscript(path.join(out, result.transcript)), item)
  if (item.kind !== 'prototype' || !result.folder || !fs.existsSync(result.folder)) return result
  result.checks = await checkPrototype(result.folder, item.checks).catch(error => [{ name: 'Code checks ran', pass: false, problems: [error.message] }])
  result.pass = result.checks.every(check => check.pass)
  // The pages it changed, against the prototype it started from.
  const fixture = path.join(path.dirname(path.dirname(path.dirname(result.folder))), 'fixtures', 'eval-prototype')
  if (fs.existsSync(fixture)) {
    result.pages = changedPages(result.folder, snapshot(fixture))
    const name = page => page.replace(/^\/(screens\/)?|\.html$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
    const rank = file => {
      const index = result.pages.findIndex(page => new RegExp(`^${name(page)}-(light|dark)`).test(path.basename(file)))
      return index < 0 ? result.pages.length : index
    }
    result.screens = [...result.screens].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
  }
  return result
}

/** A session's turns again, from its transcript, to grade the conversation again after its checks change. */
export function turnsFromTranscript(file) {
  const turns = []
  let current = null
  for (const line of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
    let event
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    if (event.type === 'assistant') {
      current ??= { text: '', toolUses: [] }
      for (const block of event.message?.content ?? []) {
        if (block.type === 'text') current.text += `${current.text ? '\n\n' : ''}${block.text}`
        if (block.type === 'tool_use') current.toolUses.push({ name: block.name, input: block.input })
      }
    }
    if (event.type === 'result' && current) {
      turns.push(current)
      current = null
    }
  }
  if (current) turns.push(current)
  return turns
}
