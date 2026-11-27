// Publishes a run's results to the docs site, for its Evals page: a small
// snapshot, committed in a pull request like any change to the docs.
//
//   docs/_data/evals/history.json   every published run's scores, for the trend
//   docs/_data/evals/latest.json    the latest of each layer, in detail enough
//                                   for the page, with short excerpts only
//   docs/evals/images/              the screenshots the page shows, as small
//                                   WebP, and nothing else
//
// A run of some layers replaces only those layers in latest.json, so a run
// of one whole task can be published beside a run of the cheap layers.
// Nothing raw is published: no transcripts, and paths on this computer are
// taken out of the excerpts.

import fs from 'node:fs'
import path from 'node:path'

import { chromium } from 'playwright'

import { cases, log, repo, writeJson } from './util.js'
import { summaryLine } from './report.js'

const dataDir = path.join(repo, 'docs', '_data', 'evals')
const imageDir = path.join(repo, 'docs', 'evals', 'images')

/** Takes this computer's paths, and anything like a key, out of text to publish. */
export function clean(text, limit = 700) {
  let value = String(text ?? '')
    .replace(/(?<![\w/.:-])(\/Users|\/home|\/private|\/var\/folders|\/tmp)\/[^\s`'")\]]+/g, match => `…/${match.split('/').slice(-2).join('/')}`)
    .replace(/\b(sk-[a-z0-9-]{8,}|gh[pousr]_[A-Za-z0-9]{12,}|AKIA[0-9A-Z]{12,})\b/g, '[redacted]')
    .trim()
  if (value.length > limit) value = `${value.slice(0, limit).replace(/\s+\S*$/, '')} …`
  return value
}

/** Markdown as the person read it, without its marks, for a page that shows it as text. */
export function plain(text) {
  return String(text ?? '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<(https?:[^>]+)>/g, '$1')
}

/** Screenshots to small WebPs, with the browser Playwright has. */
async function toWebp(files, width = 300) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const done = []
  for (const { from, to } of files) {
    const data = fs.readFileSync(from).toString('base64')
    const type = from.endsWith('.webp') ? 'image/webp' : 'image/png'
    const webp = await page.evaluate(async ({ data, type, width }) => {
      const image = new Image()
      image.src = `data:${type};base64,${data}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = Math.round(image.height * width / image.width)
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/webp', 0.8).split(',')[1]
    }, { data, type, width })
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.writeFileSync(to, Buffer.from(webp, 'base64'))
    done.push(to)
  }
  await browser.close()
  return done
}

export async function publish(out) {
  const run = JSON.parse(fs.readFileSync(path.join(out, 'results.json'), 'utf8'))
  const line = summaryLine(run)
  const readJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback)

  const history = readJson(path.join(dataDir, 'history.json'), []).filter(entry => entry.stamp !== line.stamp)
  history.push(line)
  history.sort((a, b) => a.stamp.localeCompare(b.stamp))

  const latest = readJson(path.join(dataDir, 'latest.json'), { layers: {} })
  const { triggering: t, choosing: c, reviewing: r, tasks: k } = run.layers
  const when = { stamp: run.stamp, date: run.stamp.slice(0, 10), commit: run.commit, case: run.options.case }

  if (t?.results) {
    latest.layers.triggering = {
      ...when, scores: t.scores,
      cases: t.results.map(result => ({ id: result.id, prompt: result.prompt, expect: result.expect, used: result.skills, pass: result.pass })),
      pending: t.pending.map(item => ({ prompt: item.prompt, expect: item.expect }))
    }
  }
  if (c?.results) {
    const agreed = Object.fromEntries(cases('choosing').map(item => [item.id, item]))
    latest.layers.choosing = {
      ...when, scores: c.scores, baseline: c.baseline,
      cases: c.results.filter(result => result.config === 'with-cards').map(result => ({
        id: result.id, brief: result.brief, pass: result.pass, failures: result.failures,
        require: agreed[result.id]?.require ?? [], forbid: agreed[result.id]?.forbid ?? [],
        chose: {
          template: result.answer?.template ?? null,
          patterns: result.answer?.patterns ?? [],
          elements: (result.answer?.elements ?? []).map(item => item.element + Object.entries(item.attributes ?? {}).map(([key, value]) => ` ${key}="${value}"`).join(''))
        },
        filesRead: result.read.length
      }))
    }
  }
  if (r?.results) {
    latest.layers.reviewing = {
      ...when, scores: r.scores, checker: r.checker, baseline: r.baseline,
      cases: r.results.filter(result => result.config === 'with-skill').map(result => ({
        id: result.id, clean: result.clean,
        faults: result.faults.map((fault, i) => ({ file: fault.file, rule: fault.rule, found: fault.found, level: fault.level, checker: Boolean(result.checker.faults[i]?.found) })),
        falseAlarms: result.falseAlarms.map(finding => clean(finding.text.split('\n')[0], 200))
      }))
    }
  }
  if (k?.results) {
    const stampDir = path.join(imageDir, run.stamp)
    const conversions = []
    const url = file => `/evals/images/${run.stamp}/${file}`
    // A screen's light and dark pictures, from the run's PNGs, as WebP.
    const pair = (pngs, name, prefix) => {
      const pictures = { name: name.replace(/-/g, ' ') }
      for (const scheme of ['light', 'dark']) {
        const from = pngs.find(file => path.basename(file) === `${name}-${scheme}.png`)
        if (!from) continue
        const to = `${prefix}${name}-${scheme}.webp`
        conversions.push({ from, to: path.join(stampDir, to) })
        pictures[scheme] = url(to)
      }
      return pictures
    }
    const showcases = []
    for (const result of k.results.filter(result => result.config === 'with-skill')) {
      const task = cases('tasks').find(item => item.id === result.id)
      // Every screen it made, in the journey's order, and what the judge had
      // beside them: the screens of the app's templates, and any design.
      const pngs = (result.screens ?? []).map(file => path.join(out, file)).filter(file => /-(light|dark)\.png$/.test(file))
      const names = [...new Set(pngs.map(file => path.basename(file).replace(/-(light|dark)\.png$/, '')))]
      const screens = names.map(name => pair(pngs, name, `${result.id}-`))
      const referencePngs = (result.judge?.references ?? []).map(file => path.join(out, file))
      const referenceNames = [...new Set(referencePngs.map(file => path.basename(file).replace(/-(light|dark)\.png$/, '')))]
      const references = referenceNames.map(name => pair(referencePngs, name, 'app-'))
      let design = null
      if (task?.design) {
        const to = `${result.id}-design.webp`
        conversions.push({ from: path.join(repo, task.design), to: path.join(stampDir, to) })
        design = url(to)
      }
      showcases.push({
        id: result.id, title: result.title, showcase: Boolean(task?.showcase), kind: result.kind,
        brief: task?.brief ?? '', opening: task?.opening ?? '',
        pass: result.pass, endedBy: result.endedBy, turns: result.turns,
        checks: (result.checks ?? []).map(check => ({ name: check.name, pass: check.pass, note: check.note ?? null, problems: (check.problems ?? []).slice(0, 3).map(problem => clean(problem, 200)) })),
        conversation: result.conversation,
        judge: result.judge?.scores ?? null,
        excerpt: (result.excerpt ?? []).slice(0, 6).map(entry => ({ role: entry.role, text: clean(plain(entry.text), 600) })),
        screens, references, design,
        tokens: (result.usage?.total ?? 0) + (result.designerUsage?.total ?? 0) + (result.judgeUsage?.total ?? 0),
        minutes: Math.round((result.durationMs ?? 0) / 60000)
      })
    }
    // The showcase first, then the rest in the cases' order.
    showcases.sort((a, b) => Number(b.showcase) - Number(a.showcase))
    // The judge's references are the same for every task: keep one copy.
    const seen = new Set()
    await toWebp(conversions.filter(({ to }) => !seen.has(to) && seen.add(to)))
    latest.layers.tasks = { ...when, scores: k.scores, showcases }
  }
  latest.updated = run.stamp

  // Only the images the page shows.
  const shown = new Set((latest.layers.tasks?.showcases ?? []).flatMap(showcase => [
    ...[...(showcase.screens ?? []), ...(showcase.references ?? [])].flatMap(screen => [screen.light, screen.dark]),
    showcase.design
  ]).filter(Boolean))
  if (fs.existsSync(imageDir)) {
    for (const stamp of fs.readdirSync(imageDir)) {
      for (const file of fs.readdirSync(path.join(imageDir, stamp))) {
        if (!shown.has(`/evals/images/${stamp}/${file}`)) fs.rmSync(path.join(imageDir, stamp, file))
      }
      if (!fs.readdirSync(path.join(imageDir, stamp)).length) fs.rmdirSync(path.join(imageDir, stamp))
    }
  }

  writeJson(path.join(dataDir, 'history.json'), history)
  writeJson(path.join(dataDir, 'latest.json'), latest)
  log(`Published to docs/_data/evals/ and docs/evals/images/. Check the Evals page with npm start, then commit them in a pull request.`)
}
