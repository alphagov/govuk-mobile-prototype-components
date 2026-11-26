// Screenshots of the prototype's screens, in light and dark, on the phone, so
// Claude can look at what it has made. It also says what's broken on each
// screen: a script that failed, a file that isn't there, a link to a page
// that isn't there.
//
//   npm run screenshots -- /screens/settings/index.html     one screen, or several
//   npm run screenshots -- --all                            every screen in prototype.json
//   npm run screenshots -- --answers '{"registration":"AB12 CDE"}' /screens/vehicles/check.html
//   npm run screenshots -- --install-browser                download a browser to draw with
//
// They go in .screenshots/, named after each screen: settings-index-light.png
// and -dark.png, and -light-end.png and -dark-end.png, scrolled to the end,
// for a screen longer than the phone. It starts a copy of the prototype of its own, so it doesn't
// matter whether one is running.
//
// It draws with a browser that's already on the computer if it can: Google
// Chrome, Chromium, Microsoft Edge or Brave, started out of sight, with an
// empty profile of its own, so the person's own browsing is never touched.
// If there's none, it stops and says so, and --install-browser downloads
// Google's Chrome Headless Shell (about 100MB), once, into a folder every
// prototype on this computer shares. No dependencies: it talks to the
// browser itself, over the DevTools protocol.

import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, '.screenshots')
const schemes = ['light', 'dark']
const answersKey = 'govuk-app-prototype-answers'

// Shared by every prototype, so the browser is downloaded once.
const cache = path.join(process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), '.cache'), 'govuk-app-prototype')

const { values: options, positionals: pages } = parseArgs({
  allowPositionals: true,
  options: {
    all: { type: 'boolean' },
    answers: { type: 'string' },
    scheme: { type: 'string' },
    'install-browser': { type: 'boolean' },
    'find-browser': { type: 'boolean' }
  }
})

if (options['install-browser']) {
  await installBrowser()
  process.exit()
}

if (options['find-browser']) {
  const browser = findBrowser()
  console.log(browser ?? 'none')
  process.exit(browser ? 0 : 3)
}

let answers = null
if (options.answers) {
  try {
    answers = JSON.parse(options.answers)
  } catch {
    stop('--answers must be JSON, such as \'{"registration":"AB12 CDE"}\'.')
  }
}

if (options.all) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'prototype.json'), 'utf8'))
  pages.push(...(manifest.screens ?? []).map(screen => screen.path))
}
if (!pages.length) stop('Name a screen to screenshot, such as /screens/settings/index.html, or --all.')

const browserPath = findBrowser()
if (!browserPath) {
  console.error('NO_BROWSER: there’s no browser on this computer to take screenshots with.')
  console.error('Ask the person, then run: npm run screenshots -- --install-browser')
  process.exit(3)
}

const server = await startServer()
const browser = await startBrowser(browserPath)
fs.mkdirSync(out, { recursive: true })

let problems = 0
try {
  for (const page of pages) {
    const urlPath = new URL(page, 'http://localhost').pathname
    const name = urlPath.replace(/^\/(screens\/)?|\.html$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'start'
    const found = new Set()
    for (const scheme of options.scheme ? [options.scheme] : schemes) {
      const file = path.join(out, `${name}-${scheme}.png`)
      const result = await shoot(`${server.base}${urlPath}`, scheme, file)
      for (const problem of result.problems) found.add(problem)
      for (const shot of result.files) console.log(path.relative(root, shot))
    }
    for (const problem of found) console.log(`  Problem: ${problem}`)
    problems += found.size
  }
} finally {
  await browser.close()
  server.close()
}
// Done: nothing left to wait for, such as a connection kept open to reuse.
process.exit(problems ? 1 : 0)

/** Stops with a message anyone can read. */
function stop(message) {
  console.error(message)
  process.exit(1)
}

/** A browser that can draw headless, or nothing. */
function findBrowser() {
  const candidates = []
  if (process.env.GOVUK_APP_BROWSER) candidates.push(process.env.GOVUK_APP_BROWSER)
  // One downloaded by --install-browser, chosen for this.
  candidates.push(path.join(cache, 'browser', `chrome-headless-shell-${platform()}`, process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell'))
  if (process.platform === 'darwin') {
    for (const applications of ['/Applications', path.join(os.homedir(), 'Applications')]) {
      candidates.push(
        `${applications}/Google Chrome.app/Contents/MacOS/Google Chrome`,
        `${applications}/Chromium.app/Contents/MacOS/Chromium`,
        `${applications}/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`,
        `${applications}/Brave Browser.app/Contents/MacOS/Brave Browser`
      )
    }
  } else if (process.platform === 'win32') {
    for (const base of [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      candidates.push(path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Microsoft/Edge/Application/msedge.exe'))
    }
  } else {
    for (const dir of (process.env.PATH ?? '').split(path.delimiter)) {
      for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge']) candidates.push(path.join(dir, name))
    }
  }
  return candidates.find(file => {
    try {
      return fs.statSync(file).isFile()
    } catch {
      return false
    }
  }) ?? null
}

/** Chrome for Testing's name for this computer. */
function platform() {
  if (process.platform === 'darwin') return process.arch === 'arm64' ? 'mac-arm64' : 'mac-x64'
  if (process.platform === 'win32') return 'win64'
  return process.arch === 'arm64' ? 'linux-arm64' : 'linux64'
}

/**
 * Downloads Chrome Headless Shell, the latest stable, from Google's Chrome
 * for Testing, checked against the hash Google's storage gives for it.
 */
async function installBrowser() {
  const target = path.join(cache, 'browser')
  const index = await fetch('https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json')
    .then(response => response.json())
    .catch(() => stop('Couldn’t reach Google to download the browser. Check the internet connection, and try again.'))
  const stable = index.channels.Stable
  const download = stable.downloads['chrome-headless-shell'].find(item => item.platform === platform())
  if (!download) stop(`There’s no browser to download for this computer (${platform()}).`)

  console.log(`Downloading Chrome Headless Shell ${stable.version}, about 100MB…`)
  const response = await fetch(download.url).catch(() => null)
  if (!response?.ok) stop('Couldn’t download the browser. Check the internet connection, and try again.')
  const zip = Buffer.from(await response.arrayBuffer())
  const expected = (response.headers.get('x-goog-hash') ?? '').match(/md5=([^,\s]+)/)?.[1]
  if (expected && crypto.createHash('md5').update(zip).digest('base64') !== expected) {
    stop('The browser didn’t download properly. Try again.')
  }

  fs.rmSync(target, { recursive: true, force: true })
  fs.mkdirSync(target, { recursive: true })
  const file = path.join(target, 'download.zip')
  fs.writeFileSync(file, zip)
  const unzip = await run(process.platform === 'win32' ? 'tar' : 'unzip', process.platform === 'win32' ? ['-xf', file, '-C', target] : ['-q', '-o', file, '-d', target])
  fs.rmSync(file)
  if (unzip !== 0) stop('Couldn’t unpack the browser.')
  console.log(`Installed, in ${target}. Every prototype on this computer will use it.`)
}

function run(command, args) {
  return new Promise(resolve => spawn(command, args, { stdio: 'inherit' }).on('close', resolve).on('error', () => resolve(1)))
}

/** A copy of the prototype's server, on a port of its own. */
function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: '3900' }, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    const listen = chunk => {
      output += chunk
      const port = output.match(/http:\/\/localhost:(\d+)/)?.[1]
      if (port) resolve({ base: `http://localhost:${port}`, close: () => child.kill() })
    }
    child.stdout.on('data', listen)
    child.stderr.on('data', chunk => { output += chunk })
    child.on('exit', () => reject(new Error(`The prototype wouldn’t start: ${output.trim()}`)))
  })
}

/** Starts the browser out of sight, and connects to it. */
async function startBrowser(executable) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'govuk-app-screenshots-'))
  const child = spawn(executable, [
    '--headless', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio',
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  const endpoint = await new Promise((resolve, reject) => {
    let output = ''
    child.stderr.on('data', chunk => {
      output += chunk
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/)
      if (match) resolve(match[1])
    })
    child.on('exit', () => reject(new Error(`The browser stopped before it started: ${output.trim().split('\n').slice(-3).join(' ')}`)))
    setTimeout(() => reject(new Error('The browser took too long to start.')), 30000).unref()
  })
  const connection = await connect(endpoint)
  return {
    ...connection,
    async close() {
      const exited = new Promise(resolve => child.once('exit', resolve))
      await connection.send('Browser.close').catch(() => {})
      connection.socket.close()
      await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 5000).unref())])
      child.kill()
      // The browser can still be writing to its profile as it closes.
      try {
        fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
      } catch {}
    }
  }
}

/** A connection to the browser over the DevTools protocol. */
function connect(endpoint) {
  const socket = new WebSocket(endpoint)
  let id = 0
  const waiting = new Map()
  const listeners = new Set()
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.id && waiting.has(message.id)) {
      const { resolve, reject } = waiting.get(message.id)
      waiting.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    } else if (message.method) {
      for (const listener of listeners) listener(message)
    }
  })
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    waiting.set(++id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params, sessionId }))
  })
  return new Promise((resolve, reject) => {
    socket.addEventListener('open', () => resolve({ socket, send, listeners }))
    socket.addEventListener('error', () => reject(new Error('Couldn’t connect to the browser.')))
  })
}

/** Screenshots one page in one scheme, and lists what's broken on it. */
async function shoot(url, scheme, file) {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true })
  const send = (method, params) => browser.send(method, params, sessionId)
  const problems = []
  const files = [file]
  const listener = ({ method, params, sessionId: from }) => {
    if (from !== sessionId) return
    if (method === 'Runtime.exceptionThrown') problems.push(`a script failed: ${params.exceptionDetails.exception?.description?.split('\n')[0] ?? params.exceptionDetails.text}`)
    if (method === 'Runtime.consoleAPICalled' && params.type === 'error') problems.push(`the page said: ${params.args.map(arg => arg.value ?? arg.description).join(' ')}`)
    if (method === 'Network.responseReceived' && params.response.status >= 400 && !params.response.url.endsWith('/favicon.ico')) problems.push(`${new URL(params.response.url).pathname} isn’t there (${params.response.status})`)
  }
  browser.listeners.add(listener)
  try {
    await send('Page.enable')
    await send('Runtime.enable')
    await send('Network.enable')
    // An iPhone 17 Pro's width with room round it, as the library's own
    // screenshots draw it, at twice the pixels.
    await send('Emulation.setDeviceMetricsOverride', { width: 470, height: 1000, deviceScaleFactor: 2, mobile: false })
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }] })
    if (answers) {
      await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem(${JSON.stringify(answersKey)}, ${JSON.stringify(JSON.stringify(answers))}) } catch {}` })
    }
    const loaded = new Promise(resolve => {
      const onLoad = ({ method, sessionId: from }) => {
        if (from === sessionId && method === 'Page.loadEventFired') {
          browser.listeners.delete(onLoad)
          resolve()
        }
      }
      browser.listeners.add(onLoad)
    })
    await send('Page.navigate', { url })
    await Promise.race([loaded, new Promise(resolve => setTimeout(resolve, 15000))])

    // Waits until every component is drawn and its fonts have loaded, as
    // the library's own screenshots do.
    const { result } = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        // <govuk-app> itself is styled, not defined: only its components are.
        const ours = name => /^govuk-(app|prototype)-/.test(name)
        const drawn = () => [...document.querySelectorAll('*')].every(element => !ours(element.localName) || customElements.get(element.localName))
          && !document.documentElement.hasAttribute('data-govuk-app-fonts-loading')
        const started = Date.now()
        while (!drawn() && Date.now() - started < 15000) await new Promise(resolve => setTimeout(resolve, 100))
        await document.fonts.ready
        await new Promise(resolve => setTimeout(resolve, 300))
        const undrawn = [...new Set([...document.querySelectorAll('*')].map(element => element.localName).filter(name => ours(name) && !customElements.get(name)))]
        const links = [...document.querySelectorAll('govuk-app a[href]')].map(link => link.href).filter(href => href.startsWith(location.origin))
        // An icon drawn in the page's own font shows as its name, such as
        // location_on: its styles don't name the icons' font.
        const words = [...document.querySelectorAll('govuk-app .govuk-app-icon')]
          .filter(icon => icon.checkVisibility() && !/Material Symbols/.test(getComputedStyle(icon).fontFamily))
          .map(icon => icon.textContent.trim())
        return { undrawn, words, links: [...new Set(links)] }
      })()`
    })
    const { undrawn = [], words = [], links = [] } = result.value ?? {}
    for (const name of undrawn) problems.push(`<${name}> isn’t drawn: is its script loaded, and is the name right?`)
    for (const word of words) problems.push(`the icon ${word} shows as its name, not an icon: give its class font-family: "Material Symbols Rounded"`)
    for (const link of links) {
      const response = await fetch(link).catch(() => null)
      if (!response?.ok) problems.push(`a link goes to ${new URL(link).pathname}, which isn’t there`)
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(file, Buffer.from(data, 'base64'))

    // A screen longer than the phone scrolls inside it, so the rest of it is
    // a second picture, scrolled to the end.
    const scrolled = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const scrollers = [...document.querySelectorAll('govuk-app *')].filter(element => {
          const overflow = getComputedStyle(element).overflowY
          return (overflow === 'auto' || overflow === 'scroll') && element.scrollHeight > element.clientHeight + 1 && element.checkVisibility()
        })
        for (const element of scrollers) element.scrollTop = element.scrollHeight
        if (scrollers.length) await new Promise(resolve => setTimeout(resolve, 300))
        return scrollers.length > 0
      })()`
    })
    if (scrolled.result.value) {
      const end = file.replace(/\.png$/, '-end.png')
      const { data } = await send('Page.captureScreenshot', { format: 'png' })
      fs.writeFileSync(end, Buffer.from(data, 'base64'))
      files.push(end)
    }
  } finally {
    browser.listeners.delete(listener)
    await browser.send('Target.closeTarget', { targetId }).catch(() => {})
  }
  return { problems, files }
}
