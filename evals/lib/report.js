// The report of a run, evals-out/<stamp>/report.html: one page, no
// dependencies, with each layer's scores against the last run's, every case,
// why each failure failed, and links to readable transcripts.

import fs from 'node:fs'
import path from 'node:path'

import { cases, seconds } from './util.js'

const escape = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])
const percent = value => (typeof value === 'number' ? `${Math.round(value * 100)}%` : '–')
const score = value => (typeof value === 'number' ? value.toFixed(1) : '–')
const tokens = usage => (usage?.total ? `${(usage.total / 1000).toFixed(0)}k` : '–')

/** A run's scores alone, for history.jsonl and the docs site. */
export function summaryLine(run) {
  const layers = {}
  const { triggering: t, choosing: c, reviewing: r, tasks: k } = run.layers
  if (t?.scores) layers.triggering = { passRate: t.scores.passRate, runs: t.scores.total, perSkill: Object.fromEntries(Object.entries(t.scores.perSkill).map(([skill, s]) => [skill, { precision: s.precision, recall: s.recall }])) }
  if (c?.scores) layers.choosing = { passRate: c.scores.passRate, runs: c.scores.total, meanBytesRead: c.scores.meanBytesRead, baseline: c.baseline?.passRate ?? null }
  if (r?.scores) layers.reviewing = { recall: r.scores.recall, found: r.scores.found, planted: r.scores.planted, falseAlarms: r.scores.falseAlarms, cleanRuns: r.scores.cleanRuns, checkerRecall: r.checker.recall, baseline: r.baseline?.recall ?? null }
  if (k?.scores) layers.tasks = { passRate: k.scores.passRate, runs: k.scores.total, judge: k.scores.judge, jargon: k.scores.jargon, baseline: k.baseline?.passRate ?? null }
  return {
    stamp: run.stamp, commit: run.commit, dirty: run.dirty, case: run.options.case,
    covered: covered(run), note: run.note ?? null,
    layers, tokens: run.usage.total ?? 0, costUsd: run.usage.costUsd ?? 0, durationMs: run.durationMs
  }
}

/** What a run covered, in words: "All four layers", or "Whole task: Set your local council". */
export function covered(run) {
  const names = { triggering: 'triggering', choosing: 'choosing', reviewing: 'reviewing', tasks: 'whole tasks' }
  const ran = Object.keys(names).filter(name => run.layers[name] && !run.layers[name].error)
  const titles = Object.fromEntries(cases('tasks').map(item => [item.id, item.title]))
  const tasks = (run.layers.tasks?.results ?? []).map(result => result.id)
  const some = run.options.case && tasks.length && tasks.length < cases('tasks').length
  const words = ran.map(name => (name === 'tasks' && some
    ? `${tasks.length === 1 ? 'whole task' : 'whole tasks'}: ${[...new Set(tasks)].map(id => titles[id] ?? id).join(', ')}`
    : names[name]))
  if (ran.length === 4 && !some) return 'All four layers'
  if (!words.length) return 'Nothing'
  const sentence = words.length > 1 ? `${words.slice(0, -1).join(', ')} and ${words.at(-1)}` : words[0]
  return sentence[0].toUpperCase() + sentence.slice(1)
}

/** The headline number for each layer, higher is better. */
export function headlines(line) {
  const l = line.layers ?? {}
  return {
    triggering: l.triggering?.passRate,
    choosing: l.choosing?.passRate,
    reviewing: l.reviewing?.recall,
    tasks: l.tasks?.passRate
  }
}

/** A readable transcript, from the CLI's stream-json. */
export function renderTranscript(jsonl, title) {
  const rows = []
  for (const line of fs.readFileSync(jsonl, 'utf8').split('\n').filter(Boolean)) {
    let event
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    if (event.type === 'user' && typeof event.message?.content === 'string') rows.push(`<div class="user"><b>User</b><pre>${escape(event.message.content)}</pre></div>`)
    if (event.type === 'user' && Array.isArray(event.message?.content)) {
      for (const block of event.message.content) {
        if (block.type === 'text') rows.push(`<div class="user"><b>User</b><pre>${escape(block.text)}</pre></div>`)
        if (block.type === 'tool_result') {
          const text = Array.isArray(block.content) ? block.content.map(item => item.text ?? `[${item.type}]`).join('\n') : String(block.content ?? '')
          rows.push(`<details class="result"><summary>Result${block.is_error ? ' (error)' : ''}</summary><pre>${escape(text.slice(0, 4000))}</pre></details>`)
        }
      }
    }
    if (event.type === 'assistant') {
      for (const block of event.message?.content ?? []) {
        if (block.type === 'text') rows.push(`<div class="assistant"><b>Claude</b><pre>${escape(block.text)}</pre></div>`)
        if (block.type === 'tool_use') rows.push(`<div class="tool"><b>${escape(block.name)}</b> <code>${escape(JSON.stringify(block.input).slice(0, 600))}</code></div>`)
      }
    }
    if (event.type === 'result') rows.push(`<div class="end">Turn ended: ${escape(event.subtype)}, ${event.num_turns} steps, $${(event.total_cost_usd ?? 0).toFixed(3)} so far</div>`)
  }
  const file = jsonl.replace(/\.jsonl$/, '.html')
  fs.writeFileSync(file, `<!doctype html><meta charset="utf-8"><title>${escape(title)}</title><style>${css}
    pre{white-space:pre-wrap;margin:.25rem 0}.user{background:var(--soft);padding:.5rem}.assistant{padding:.5rem;border-left:3px solid var(--accent)}.tool{font-size:.85rem;color:var(--muted);padding:.25rem .5rem}.result{font-size:.85rem;padding:0 .5rem}.end{font-size:.8rem;color:var(--muted);border-top:1px solid var(--line);margin:.5rem 0}
  </style><main><h1>${escape(title)}</h1>${rows.join('\n')}</main>`)
  return file
}

const css = `
  :root { color-scheme: light dark; --text: #0b0c0c; --muted: #505a5f; --line: #b1b4b6; --soft: #f3f2f1; --bg: #fff; --accent: #1d70b8; --pass: #00703c; --fail: #d4351c; }
  @media (prefers-color-scheme: dark) { :root { --text: #f3f2f1; --muted: #b1b4b6; --line: #505a5f; --soft: #262829; --bg: #121314; --accent: #5694ca; --pass: #4cbb7f; --fail: #f47738; } }
  body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.45 system-ui, sans-serif; }
  main { max-width: 1100px; margin: 0 auto; padding: 1rem; }
  table { border-collapse: collapse; width: 100%; margin: .5rem 0 1.5rem; font-size: .9rem; }
  th, td { text-align: left; vertical-align: top; padding: .35rem .5rem; border-bottom: 1px solid var(--line); }
  .pass { color: var(--pass); font-weight: 600; } .fail { color: var(--fail); font-weight: 600; }
  .muted { color: var(--muted); } a { color: var(--accent); }
  .shots { display: flex; flex-wrap: wrap; gap: .5rem; } .shots figure { margin: 0; width: 180px; font-size: .75rem; }
  .shots img { width: 100%; border: 1px solid var(--line); border-radius: 8px; }
  .card { border: 1px solid var(--line); border-radius: 8px; padding: .75rem 1rem; margin: 1rem 0; }
  .talk p { margin: .25rem 0; white-space: pre-wrap; } .talk .designer { color: var(--muted); }
`

function change(now, then) {
  if (typeof now !== 'number' || typeof then !== 'number') return '<span class="muted">–</span>'
  const delta = Math.round((now - then) * 100)
  if (!delta) return '<span class="muted">no change</span>'
  return `<span class="${delta > 0 ? 'pass' : 'fail'}">${delta > 0 ? '+' : ''}${delta} points</span>`
}

const link = (out, file, text = 'transcript') => {
  if (!file) return ''
  const full = path.join(out, file)
  if (!fs.existsSync(full)) return ''
  const html = file.endsWith('.jsonl') ? path.relative(out, renderTranscript(full, file)) : file
  return `<a href="${escape(html)}">${text}</a>`
}

export function writeReport(out, run, history) {
  const line = summaryLine(run)
  // The last run before this one with the layer, all of its cases.
  const previous = layer => [...history].reverse().find(entry => !entry.case && entry.layers?.[layer])
  const now = headlines(line)
  const names = { triggering: 'Layer 1, triggering: right skill, or none', choosing: 'Layer 2, choosing: agreed answer', reviewing: 'Layer 3, reviewing: planted faults found', tasks: 'Layer 4, whole tasks: code checks pass' }
  const sections = []

  sections.push(`<h2>Summary</h2><table><tr><th>Layer</th><th>This run</th><th>Last run</th><th>Change</th><th>Tokens</th><th>Time</th></tr>${
    Object.keys(names).filter(name => run.layers[name]).map(name => {
      const before = previous(name)
      const then = before ? headlines(before)[name] : null
      const layer = run.layers[name]
      return `<tr><td>${names[name]}${layer.error ? ` <span class="fail">stopped: ${escape(layer.error.split('\n')[0])}</span>` : ''}</td><td>${percent(now[name])}</td><td>${percent(then)}${before ? ` <span class="muted">${escape(before.stamp.slice(0, 10))}</span>` : ''}</td><td>${run.options.case ? '<span class="muted">one case</span>' : change(now[name], then)}</td><td>${tokens(layer.usage)}</td><td>${seconds(layer.durationMs ?? 0)}s</td></tr>`
    }).join('')
  }</table>`)

  const t = run.layers.triggering
  if (t?.results) {
    sections.push(`<h2 id="triggering">${names.triggering}</h2>
      <p>${t.scores.passed} of ${t.scores.total} runs did the right thing. prototype-setup before the skill a message is for is allowed: its description says to use it at the start of every session.</p>
      <table><tr><th>Skill</th><th>Precision</th><th>Recall</th><th>Right</th><th>Wrongly used</th><th>Missed</th></tr>${
        Object.entries(t.scores.perSkill).map(([skill, s]) => `<tr><td>${escape(skill)}</td><td>${percent(s.precision)}</td><td>${percent(s.recall)}</td><td>${s.tp}</td><td>${s.fp}</td><td>${s.fn}</td></tr>`).join('')
      }</table>
      <table><tr><th>Case</th><th>Message</th><th>Expected</th><th>Used</th><th></th><th>Tokens</th><th>Time</th></tr>${
        t.results.map(result => `<tr><td>${escape(result.id)}${result.n > 1 ? ` #${result.n}` : ''}</td><td>${escape(result.prompt)}</td><td>${escape(result.expect ?? 'none')}</td><td>${escape(result.skills.join(', ') || 'none')}</td><td class="${result.pass ? 'pass' : 'fail'}">${result.pass ? 'Right' : 'Wrong'}</td><td>${tokens(result.usage)}</td><td>${seconds(result.durationMs)}s ${link(out, result.transcript)}</td></tr>`).join('')
      }</table>
      ${t.pending.length ? `<p>Pending, for skills not here yet: ${t.pending.map(item => `<code>${escape(item.id)}</code> (${escape(item.expect)})`).join(', ')}.</p>` : ''}`)
  }

  const c = run.layers.choosing
  if (c?.results) {
    sections.push(`<h2 id="choosing">${names.choosing}</h2>
      <p>${c.scores.passed} of ${c.scores.total} met their agreed answer, reading ${c.scores.meanFilesRead?.toFixed(1)} files (${Math.round((c.scores.meanBytesRead ?? 0) / 1000)}KB) on average.${c.baseline ? ` With the index alone, no cards: ${percent(c.baseline.passRate)}.` : ''}</p>
      <table><tr><th>Case</th><th>Brief</th><th></th><th>Why</th><th>Read</th><th>Tokens</th><th>Time</th></tr>${
        c.results.map(result => `<tr><td>${escape(result.id)}${result.config !== 'with-cards' ? ` <span class="muted">${escape(result.config)}</span>` : ''}</td><td>${escape(result.brief)}</td><td class="${result.pass ? 'pass' : 'fail'}">${result.pass ? 'Met' : 'Missed'}</td><td>${escape(result.failures.join('; '))}<details><summary class="muted">answer</summary><pre>${escape(JSON.stringify(result.answer, null, 1))}</pre></details></td><td>${result.read.length} files, ${Math.round(result.bytesRead / 1000)}KB</td><td>${tokens(result.usage)}</td><td>${seconds(result.durationMs)}s ${link(out, result.transcript)}</td></tr>`).join('')
      }</table>`)
  }

  const r = run.layers.reviewing
  if (r?.results) {
    sections.push(`<h2 id="reviewing">${names.reviewing}</h2>
      <p>The review found ${r.scores.found} of ${r.scores.planted} planted faults (${percent(r.scores.recall)}), with ${r.scores.falseAlarms} false alarm(s) on ${r.scores.cleanRuns} clean change(s). check.js alone found ${r.checker.found} of ${r.checker.planted} (${percent(r.checker.recall)}).${r.baseline ? ` Without the skill: ${percent(r.baseline.recall)}, ${r.baseline.falseAlarms} false alarm(s).` : ''}</p>
      <table><tr><th>Case</th><th>Planted fault</th><th>Review</th><th>check.js</th></tr>${
        r.results.flatMap(result => {
          const rows = result.faults.map((fault, i) => `<tr><td>${i ? '' : `${escape(result.id)}${result.config !== 'with-skill' ? ` <span class="muted">${escape(result.config)}</span>` : ''}<br>${link(out, result.report, 'report')} ${link(out, result.transcript)} <span class="muted">${tokens(result.usage)}, ${seconds(result.durationMs)}s${result.usedSkill ? '' : ', skill not used'}</span>`}</td><td>${escape(fault.file)}: ${escape(fault.rule)}</td><td class="${fault.found ? 'pass' : 'fail'}">${fault.found ? `Found (${fault.level})` : 'Missed'}</td><td class="${result.checker.faults[i]?.found ? 'pass' : 'fail'}">${result.checker.faults[i]?.found ? 'Found' : 'Missed'}</td></tr>`)
          if (result.clean) rows.push(`<tr><td>${escape(result.id)} <span class="muted">clean</span><br>${link(out, result.report, 'report')} ${link(out, result.transcript)}</td><td>No faults planted</td><td class="${result.falseAlarms.length ? 'fail' : 'pass'}">${result.falseAlarms.length ? `${result.falseAlarms.length} false alarm(s): ${escape(result.falseAlarms.map(f => f.text.split('\n')[0]).join(' | ').slice(0, 400))}` : 'No must or should fixes'}</td><td>${result.checker.others.length ? `${result.checker.others.length} finding(s)` : 'Nothing'}</td></tr>`)
          if (!result.clean && result.otherFindings.length) rows.push(`<tr><td></td><td class="muted">Other must or should fixes</td><td colspan="2" class="muted">${escape(result.otherFindings.map(f => f.text.split('\n')[0]).join(' | ').slice(0, 500))}</td></tr>`)
          if (!result.parsed) rows.push(`<tr><td></td><td colspan="3" class="fail">No findings could be read from its report: check the report's format</td></tr>`)
          return rows
        }).join('')
      }</table>`)
  }

  const k = run.layers.tasks
  if (k?.results) {
    sections.push(`<h2 id="tasks">${names.tasks}</h2>
      <p>${k.scores.passed} of ${k.scores.total} passed every code check. The judge's mean scores, out of 5: looks like the app ${score(k.scores.judge.looksLikeApp)}, hierarchy ${score(k.scores.judge.hierarchy)}, dark mode ${score(k.scores.judge.darkMode)}, matches the design ${score(k.scores.judge.matchesDesign)}. They're for trends, not pass or fail.</p>
      ${k.results.map(result => `<div class="card">
        <h3>${escape(result.title ?? result.id)} <span class="muted">${escape(result.config)}, run ${result.n}</span> <span class="${result.pass ? 'pass' : 'fail'}">${result.pass ? 'Passed' : 'Failed'}</span></h3>
        ${result.error ? `<pre class="fail">${escape(result.error)}</pre>` : ''}
        <p class="muted">${result.turns ?? 0} turns, ended: ${escape(result.endedBy)}. ${tokens(result.usage)} tokens for the skill, ${tokens(result.designerUsage)} for the designer, ${tokens(result.judgeUsage)} for the judge, ${seconds(result.durationMs ?? 0)}s. ${link(out, result.transcript, 'Transcript')}</p>
        <table><tr><th>Check</th><th></th><th>Detail</th></tr>${
          (result.checks ?? []).map(check => `<tr><td>${escape(check.name)}</td><td class="${check.pass ? 'pass' : 'fail'}">${check.note ?? (check.pass ? 'Pass' : 'Fail')}</td><td>${escape(check.detail ?? '')}${check.problems?.length ? `<ul>${check.problems.map(problem => `<li>${escape(problem)}</li>`).join('')}${check.more ? `<li>and ${check.more} more</li>` : ''}</ul>` : ''}</td></tr>`).join('')
        }${result.conversation ? Object.entries({ 'One question at a time': result.conversation.oneQuestion, 'A plan agreed before building': result.conversation.plan, 'Asked before installing': result.conversation.consent, 'No jargon': result.conversation.jargon }).map(([name, check]) => `<tr><td>${name}</td><td class="${check.pass ? 'pass' : 'fail'}">${check.pass ? 'Pass' : 'Fail'}</td><td>${escape(check.note)}</td></tr>`).join('') : ''}</table>
        ${result.judge?.scores ? `<table><tr><th>Judge</th><th>Score</th><th>Why</th></tr>${Object.entries(result.judge.scores).map(([key, value]) => `<tr><td>${escape(key)}</td><td>${value?.score ?? '–'}</td><td>${escape(value?.reason)}</td></tr>`).join('')}</table>` : ''}
        ${result.screens?.length ? `<div class="shots">${result.screens.map(file => `<figure><img src="${escape(file)}" alt="" loading="lazy"><figcaption>${escape(path.basename(file, '.png'))}</figcaption></figure>`).join('')}</div>` : ''}
        ${result.excerpt?.length ? `<details><summary>The conversation's start</summary><div class="talk">${result.excerpt.map(entry => `<p class="${entry.role}"><b>${entry.role === 'claude' ? 'Claude' : 'Designer'}:</b> ${escape(entry.text)}</p>`).join('')}</div></details>` : ''}
      </div>`).join('')}`)
  }

  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Evals ${escape(run.stamp)}</title><style>${css}</style>
<main>
  <h1>Evals, ${escape(run.stamp)}</h1>
  <p class="muted">At ${escape(run.commit)}${run.dirty ? ', with changes not committed' : ''}. Model: ${escape(run.model)}. ${seconds(run.durationMs)}s, ${(run.usage.total / 1e6).toFixed(2)} million tokens${run.usage.costUsd ? `, about $${run.usage.costUsd.toFixed(2)} at list prices` : ''}.${run.options.case ? ` One case: ${escape(run.options.case)}.` : ''}</p>
  ${sections.join('\n')}
</main></html>`
  fs.writeFileSync(path.join(out, 'report.html'), html)
}
