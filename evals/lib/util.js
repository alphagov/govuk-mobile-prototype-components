import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export const repo = path.resolve(import.meta.dirname, '..', '..')
export const evalsDir = path.join(repo, 'evals')

/** Reads a case file from evals/cases/. */
export function cases(name) {
  return JSON.parse(fs.readFileSync(path.join(evalsDir, 'cases', `${name}.json`), 'utf8'))
}

/** A prompt from evals/prompts/, with {{name}} filled in. */
export function prompt(name, values = {}) {
  const text = fs.readFileSync(path.join(evalsDir, 'prompts', `${name}.md`), 'utf8')
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '')
}

/** Runs tasks at most `limit` at a time, keeping their order in the results. */
export async function pool(items, limit, task) {
  const results = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await task(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

/** Runs a command, and resolves with its output, never throwing. */
export function run(command, args, options = {}) {
  return new Promise(resolve => {
    const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    const timer = options.timeoutMs ? setTimeout(() => child.kill('SIGTERM'), options.timeoutMs) : null
    child.on('close', code => {
      if (timer) clearTimeout(timer)
      resolve({ code, stdout, stderr })
    })
    child.on('error', error => resolve({ code: 1, stdout, stderr: String(error) }))
  })
}

export function runSync(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options })
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${(result.stderr || result.stdout || '').trim().split('\n').slice(-10).join('\n')}`)
  }
  return result.stdout
}

export function log(message) {
  process.stdout.write(`${message}\n`)
}

export function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

export function seconds(ms) {
  return Math.round(ms / 100) / 10
}

/** Every file under a folder, as paths relative to it. */
export function walk(dir, filter = () => true, base = dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === 'node_modules' || entry.name.startsWith('.') ? [] : walk(full, filter, base)
    const relative = path.relative(base, full)
    return filter(relative) ? [relative] : []
  })
}
