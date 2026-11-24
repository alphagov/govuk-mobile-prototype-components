// Serves the prototype on this computer, and reloads the browser when a file
// changes, so whoever is making it sees each change as soon as it's saved.
//
//   npm start
//
// No dependencies, so there's nothing to install but the library itself:
//
//   /             this folder: index.html, prototype.js, screens/, components/
//   /library/     the GOV.UK app prototype components' package, from
//                 node_modules, where library.js says it is
//
// Only this computer can see it: it listens on localhost, not the network.

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

import { library } from './library.js'

const root = import.meta.dirname
const firstPort = Number(process.env.PORT) || 3000
const lastPort = firstPort + 20

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

// Added to every page, so it reloads when a file changes. A script from this
// server, not one written into the page, so a page with a strict Content
// Security Policy (script-src 'self') still reloads.
const reloader = '<script src="/__reload.js"></script>\n'
const reloaderScript = "new EventSource('/__reload').addEventListener('change', () => location.reload())\n"

// Every browser tab that's open on the prototype, to tell when to reload.
const tabs = new Set()

if (!fs.existsSync(library)) {
  console.error('\nThe GOV.UK app components aren’t installed yet. Run npm install, then npm start.\n')
  process.exit(1)
}

/** The file a URL path names, inside `base`, or nothing if it's outside it. */
function within(base, urlPath) {
  const file = path.join(base, decodeURIComponent(urlPath))
  return file === base || file.startsWith(base + path.sep) ? file : null
}

/** The file to serve for a request's path, or nothing. */
function resolve(urlPath) {
  const [base, rest] = urlPath.startsWith('/library/')
    ? [library, urlPath.slice('/library'.length)]
    : [root, urlPath]
  let file = within(base, rest)
  if (!file) return null
  // node_modules and .git are the server's business, not the prototype's.
  if (base === root && path.relative(root, file).split(path.sep).some(part => part === 'node_modules' || part === '.git')) return null
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    return fs.statSync(file).isFile() ? file : null
  } catch {
    return null
  }
}

function notFound(response, urlPath) {
  response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  response.end(`<!doctype html><meta charset="utf-8"><title>Not found</title>
<body style="font-family: system-ui, sans-serif; margin: 2rem">
<h1>There’s no page at ${urlPath.replace(/[<>&"]/g, '')}</h1>
<p><a href="/">See all the screens in this prototype</a></p>${reloader}</body>`)
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost')

  if (url.pathname === '/__reload') {
    response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' })
    response.write(': connected\n\n')
    tabs.add(response)
    request.on('close', () => tabs.delete(response))
    return
  }

  if (url.pathname === '/__reload.js') {
    response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' })
    response.end(reloaderScript)
    return
  }

  let file
  try {
    file = resolve(url.pathname)
  } catch {
    file = null
  }
  if (!file) return notFound(response, url.pathname)

  const type = types[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
  // Never cached, so a change always shows on reload.
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-store' }

  if (type.startsWith('text/html')) {
    const html = fs.readFileSync(file, 'utf8')
    const page = html.includes('</body>') ? html.replace(/<\/body>(?![\s\S]*<\/body>)/, `${reloader}</body>`) : html + reloader
    response.writeHead(200, headers)
    response.end(page)
    return
  }

  response.writeHead(200, headers)
  fs.createReadStream(file).pipe(response)
})

// Reloads every open tab when anything in the prototype changes. Many
// changes come at once when a file is saved, so it waits for them to stop.
let timer
fs.watch(root, { recursive: true }, (event, name) => {
  if (!name || /(^|[\\/])(node_modules|\.git)([\\/]|$)/.test(name) || /(^|[\\/])\.[^\\/]*$/.test(name)) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    for (const tab of tabs) tab.write('event: change\ndata: reload\n\n')
  }, 100)
})

// Uses the first free port from 3000, so a second prototype, or anything else
// on 3000, doesn't stop this one starting.
let port = firstPort
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && port < lastPort) return server.listen(++port, 'localhost')
  console.error(`\nCouldn’t start the prototype: ${error.message}\n`)
  process.exit(1)
})
server.on('listening', () => {
  let name
  try {
    name = JSON.parse(fs.readFileSync(path.join(root, 'prototype.json'), 'utf8')).name
  } catch {}
  console.log(`\n  Your prototype${name ? `, ${name},` : ''} is running at:\n\n    http://localhost:${server.address().port}\n\n  Leave this running while you work on it. Press Ctrl+C to stop it.\n`)
})
server.listen(port, 'localhost')
