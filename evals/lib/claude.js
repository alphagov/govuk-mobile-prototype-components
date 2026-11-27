// Runs the claude CLI that's installed and signed in on this computer, for
// everything: the skill under test, the simulated designer and the judge. So
// the evals need no API key, and use whatever access the CLI has (Bedrock, or
// a Claude account).
//
// Every call reads the CLI's stream-json, keeps each event in a transcript,
// and adds up the tokens from the assistant's messages: a run stopped early,
// as the triggering layer stops one, never gets to its result event.

import { spawn } from 'node:child_process'
import fs from 'node:fs'

// The same for every call: only the project's settings, so the owner's own
// skills, plugins and MCP servers don't change what's measured, and nothing
// kept from one run to the next.
const isolated = ['--setting-sources', 'project,local', '--strict-mcp-config']

/** The environment for a nested claude: without CLAUDECODE, which stops one starting inside another. */
function environment() {
  const env = { ...process.env }
  delete env.CLAUDECODE
  return env
}

let model
/** Sets the model every call uses, such as 'sonnet', or the CLI's default if none. */
export function useModel(name) {
  model = name
}

/** Adds up what a stream of events cost. */
export class Usage {
  constructor() {
    this.messages = new Map()
    this.costUsd = 0
    this.resultCost = 0
  }

  add(event) {
    if (event.type === 'assistant' && event.message?.id && event.message.usage) {
      this.messages.set(event.message.id, event.message.usage)
    }
    // The result's cost is the session's so far, not the turn's.
    if (event.type === 'result' && typeof event.total_cost_usd === 'number') this.resultCost = event.total_cost_usd
  }

  get tokens() {
    let input = 0
    let output = 0
    let cacheRead = 0
    let cacheWrite = 0
    for (const usage of this.messages.values()) {
      input += usage.input_tokens ?? 0
      output += usage.output_tokens ?? 0
      cacheRead += usage.cache_read_input_tokens ?? 0
      cacheWrite += usage.cache_creation_input_tokens ?? 0
    }
    return { input, output, cacheRead, cacheWrite, total: input + output + cacheRead + cacheWrite }
  }

  summary() {
    return { ...this.tokens, costUsd: this.resultCost }
  }
}

/** Adds one usage summary to another. */
export function addUsage(a = {}, b = {}) {
  const keys = ['input', 'output', 'cacheRead', 'cacheWrite', 'total', 'costUsd']
  return Object.fromEntries(keys.map(key => [key, (a[key] ?? 0) + (b[key] ?? 0)]))
}

function baseArgs(args) {
  return ['-p', '--output-format', 'stream-json', '--verbose', ...isolated, ...(model ? ['--model', model] : []), ...args]
}

/**
 * One prompt, one run. `onEvent(event, stop)` sees every event, and can stop
 * the run as soon as it knows enough.
 */
export function runOnce({ cwd, prompt, args = [], transcript, timeoutMs = 10 * 60_000, onEvent }) {
  return new Promise(resolve => {
    const started = Date.now()
    // The prompt goes in on stdin, as an option that takes a list, such as
    // --allowedTools, would take a prompt after it for one of its own.
    const child = spawn('claude', baseArgs(['--no-session-persistence', ...args]), { cwd, env: environment(), stdio: ['pipe', 'pipe', 'pipe'] })
    child.stdin.end(prompt)
    const usage = new Usage()
    const out = transcript ? fs.createWriteStream(transcript) : null
    const toolUses = []
    const texts = []
    let result = null
    let stopped = false
    let stderr = ''
    let buffer = ''

    const stop = reason => {
      if (stopped) return
      stopped = reason ?? true
      child.kill('SIGTERM')
    }
    const timer = setTimeout(() => stop('timeout'), timeoutMs)

    child.stderr.on('data', chunk => { stderr += chunk })
    child.stdout.on('data', chunk => {
      buffer += chunk
      let newline
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline).trim()
        buffer = buffer.slice(newline + 1)
        if (!line) continue
        out?.write(`${line}\n`)
        let event
        try {
          event = JSON.parse(line)
        } catch {
          continue
        }
        usage.add(event)
        if (event.type === 'assistant') {
          for (const block of event.message?.content ?? []) {
            if (block.type === 'tool_use') toolUses.push({ name: block.name, input: block.input })
            if (block.type === 'text') texts.push(block.text)
          }
        }
        if (event.type === 'result') result = event
        if (!stopped) onEvent?.(event, stop)
      }
    })
    child.on('close', code => {
      clearTimeout(timer)
      out?.end()
      resolve({
        result,
        text: result?.result ?? texts.join('\n\n'),
        structured: result?.structured_output ?? null,
        toolUses,
        usage: usage.summary(),
        durationMs: Date.now() - started,
        stopped,
        exitCode: code,
        error: !result && !stopped ? stderr.trim().split('\n').slice(-5).join('\n') || `claude exited with ${code}` : null
      })
    })
  })
}

/**
 * A conversation of several turns, in one claude process: each `send` is a
 * user message, and resolves with everything the assistant did and said
 * until its turn ended. `onEvent(event, stop)` can end it early, such as when
 * it's about to push.
 */
export function startSession({ cwd, args = [], transcript, onEvent }) {
  const child = spawn('claude', baseArgs(['--input-format', 'stream-json', ...args]), { cwd, env: environment(), stdio: ['pipe', 'pipe', 'pipe'] })
  const usage = new Usage()
  const out = transcript ? fs.createWriteStream(transcript) : null
  const turns = []
  let current = null
  let buffer = ''
  let stderr = ''
  let closed = false
  let stopped = false
  const started = Date.now()

  const finishTurn = (extra = {}) => {
    if (!current) return
    const turn = current
    current = null
    turn.resolve({ text: turn.texts.join('\n\n'), toolUses: turn.toolUses, ...extra })
  }
  const stop = reason => {
    if (stopped) return
    stopped = reason ?? true
    child.kill('SIGTERM')
  }

  child.stderr.on('data', chunk => { stderr += chunk })
  child.stdout.on('data', chunk => {
    buffer += chunk
    let newline
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim()
      buffer = buffer.slice(newline + 1)
      if (!line) continue
      out?.write(`${line}\n`)
      let event
      try {
        event = JSON.parse(line)
      } catch {
        continue
      }
      usage.add(event)
      if (current && event.type === 'assistant') {
        for (const block of event.message?.content ?? []) {
          if (block.type === 'tool_use') current.toolUses.push({ name: block.name, input: block.input })
          if (block.type === 'text') current.texts.push(block.text)
        }
      }
      if (!stopped) onEvent?.(event, stop)
      if (event.type === 'result') finishTurn({ result: event })
    }
  })
  child.on('close', () => {
    closed = true
    out?.end()
    finishTurn({ ended: stopped || 'exited', error: stderr.trim().split('\n').slice(-5).join('\n') })
  })

  return {
    turns,
    send(text, { timeoutMs = 20 * 60_000 } = {}) {
      if (closed) return Promise.resolve({ text: '', toolUses: [], ended: stopped || 'exited' })
      return new Promise(resolve => {
        const timer = setTimeout(() => stop('timeout'), timeoutMs)
        current = {
          texts: [],
          toolUses: [],
          resolve: value => {
            clearTimeout(timer)
            turns.push({ user: text, ...value })
            resolve(value)
          }
        }
        child.stdin.write(`${JSON.stringify({ type: 'user', message: { role: 'user', content: text } })}\n`)
      })
    },
    async close() {
      if (!closed) {
        child.stdin.end()
        await new Promise(resolve => {
          const timer = setTimeout(() => { child.kill('SIGTERM'); resolve() }, 10_000)
          child.once('close', () => { clearTimeout(timer); resolve() })
        })
      }
      return { usage: usage.summary(), durationMs: Date.now() - started, stopped }
    },
    get stopped() {
      return stopped
    }
  }
}
