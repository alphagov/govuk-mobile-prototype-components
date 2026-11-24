// Screenshots of the components and examples, in light and dark, drawn by a
// headless Chromium. For seeing what a component looks like without a
// browser: in a terminal, or for a model checking its own work.
//
//   npm run screenshots                    every component's examples, and every example page
//   npm run screenshots -- button          one component's examples
//   npm run screenshots -- --examples      only the example pages
//   npm run screenshots -- --url /path/    any page of the site
//   npm run screenshots -- --no-build      use the site already in _site/
//
// They go in screenshots-out/, with an index.html that puts each component's
// screenshots beside the app's own, from its reference/ folder.

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { chromium } from 'playwright'

const root = path.resolve(import.meta.dirname, '..')
const site = path.join(root, '_site')
const out = path.join(root, 'screenshots-out')
const schemes = ['light', 'dark']

const { values: options, positionals: components } = parseArgs({
  allowPositionals: true,
  options: {
    examples: { type: 'boolean' },
    url: { type: 'string' },
    build: { type: 'boolean', default: true }
  },
  allowNegative: true
})

if (options.build) execSync('npm run build', { cwd: root, stdio: 'inherit' })

const definitions = readDefinitions()
const jobs = []
if (options.url) {
  jobs.push(...pageJobs(options.url))
} else {
  if (!options.examples) {
    for (const slug of components.length ? components : Object.keys(definitions)) {
      if (!definitions[slug]) {
        console.error(`There is no component called ${slug}: no src/components/${slug}/${slug}.json`)
        process.exit(1)
      }
      clean(slug)
      for (const scheme of schemes) jobs.push({ url: `/components/${slug}/`, scheme, dir: slug, examples: true })
    }
  }
  if (options.examples || !components.length) {
    clean('examples')
    // In a folder: examples/index.html is the docs page that lists them.
    for (const file of fs.globSync('examples/*/**/*.html', { cwd: site })) {
      const name = file.replace(/^examples\//, '').replace(/\.html$/, '')
      for (const scheme of schemes) jobs.push({ url: `/${file}`, scheme, dir: 'examples', name, phone: true })
    }
  }
}

const started = Date.now()
const server = await serve(site)
const browser = await launch()
const base = `http://localhost:${server.address().port}`

// A few pages at a time: quicker, without starving the machine.
const queue = [...jobs]
let count = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const shots = await shoot(queue.shift())
    count += shots
  }
}))

await browser.close()
server.close()
writeIndex()
console.log(`${count} screenshots in ${((Date.now() - started) / 1000).toFixed(1)}s: ${path.relative(root, out)}/index.html`)

/**
 * The jobs for any one page: its docs examples if it has any, or the page.
 * An .html file, such as an example or a prototype, is drawn on a phone; a
 * docs page, such as a pattern's, at a desktop's width.
 */
function pageJobs(url) {
  const dir = path.join('pages', url.replace(/^\/|\/$|\.html$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home')
  clean(dir)
  const phone = url.endsWith('.html')
  return schemes.map(scheme => ({ url, scheme, dir, name: 'page', examples: 'if-any', phone }))
}

/**
 * Screenshots one page in one scheme. examples: true takes only its docs
 * examples; 'if-any' takes the whole page if it has none; absent takes the page.
 */
async function shoot({ url, scheme, dir, name, examples, phone }) {
  // Example pages are a phone, as wide as an iPhone 17 Pro with room round it,
  // so its scale works out at 1. Docs pages are a desktop's width.
  const viewport = phone ? { width: 470, height: 1000 } : { width: 1280, height: 900 }
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: 'reduce' })
  page.on('pageerror', error => console.warn(`${url}: ${error.message}`))
  const response = await page.goto(base + url)
  if (!response.ok()) throw new Error(`${url}: ${response.status()}`)
  await ready(page)

  fs.mkdirSync(path.join(out, dir), { recursive: true })
  const shots = []
  // Each of a docs page's examples is drawn twice, each with its own
  // colour-scheme: the colorScheme above sets the device's to match.
  const boxes = examples ? await page.locator('.docs-example').all() : []
  if (boxes.length) {
    // Named by its own heading, not one an example draws. One in a
    // component's prose has none.
    const names = await page.$$eval('.docs-example', boxes => boxes.map(box => box.querySelector(':scope > h3')?.textContent ?? 'prose'))
    slugs(names).forEach((slug, index) => {
      const frame = boxes[index].locator(`govuk-app[colour-scheme="${scheme}"]`)
      shots.push(frame.screenshot({ path: path.join(out, dir, `${slug}-${scheme}.png`), animations: 'disabled' }))
    })
  } else if (examples !== true) {
    const file = path.join(out, dir, `${name}-${scheme}.png`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    shots.push(page.screenshot({ path: file, animations: 'disabled' }))
  }
  await Promise.all(shots)
  await page.close()
  return shots.length
}

/**
 * Waits until every component is drawn and its fonts have loaded, or fails
 * after Playwright's 30 seconds. The <govuk-app> root is styled, not defined,
 * so only its components are waited for.
 */
async function ready(page) {
  await page.waitForFunction(() => [...document.querySelectorAll('*')]
    .every(element => !element.localName.startsWith('govuk-app-') || customElements.get(element.localName)))
  // component.js marks the page while an icon font loads, and hides icons till then.
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-govuk-app-fonts-loading'))
  await page.evaluate(() => document.fonts.ready)
}

async function launch() {
  try {
    return await chromium.launch()
  } catch (error) {
    if (/Executable doesn't exist/.test(error.message)) {
      console.error('Playwright has no Chromium to draw with. Install it with:\n\n  npx playwright install chromium\n')
      process.exit(1)
    }
    throw error
  }
}

/** Serves a folder on a free port, as the docs site is served. */
function serve(folder) {
  const types = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
    '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon'
  }
  const server = http.createServer((request, response) => {
    let file = path.join(folder, decodeURIComponent(new URL(request.url, 'http://x').pathname))
    if (!file.startsWith(folder)) file = folder
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    if (!fs.existsSync(file)) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(response)
  })
  return new Promise(resolve => server.listen(0, () => resolve(server)))
}

function readDefinitions() {
  const definitions = {}
  for (const file of fs.globSync('src/components/*/*.json', { cwd: root })) {
    const slug = path.basename(path.dirname(file))
    if (path.basename(file) === `${slug}.json`) definitions[slug] = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
  }
  return Object.fromEntries(Object.entries(definitions).sort(([a], [b]) => a.localeCompare(b)))
}

/** A file name for each example's name, numbered where two would be the same. */
function slugs(names) {
  const seen = new Map()
  return names.map(name => {
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'example'
    seen.set(slug, (seen.get(slug) ?? 0) + 1)
    return seen.get(slug) > 1 ? `${slug}-${seen.get(slug)}` : slug
  })
}

function clean(dir) {
  fs.rmSync(path.join(out, dir), { recursive: true, force: true })
}

/**
 * A contact sheet of everything in screenshots-out/, from earlier runs too:
 * each component's examples, light beside dark, then the app's own
 * screenshots to compare them with. Its paths are relative, so it opens
 * from disk.
 */
function writeIndex() {
  const exists = file => fs.existsSync(path.join(out, file))
  const escape = text => String(text).replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`)
  const pair = (prefix, caption) => `
    <figure><figcaption>${escape(caption)}</figcaption>
      <div class="pair">${schemes.map(scheme => `<img src="${prefix}-${scheme}.png" alt="${scheme}">`).join('')}</div>
    </figure>`

  const sections = []
  for (const [slug, definition] of Object.entries(definitions)) {
    if (!exists(slug)) continue
    const names = definition.examples.map(example => example.name)
    const files = slugs(names)
    const shots = files.map((file, index) => exists(`${slug}/${file}-light.png`) ? pair(`${slug}/${file}`, names[index]) : '')
    // And those of examples in its prose, which aren't in its definition.
    for (const file of fs.globSync('*-light.png', { cwd: path.join(out, slug) }).sort()) {
      const prefix = file.replace(/-light\.png$/, '')
      if (!files.includes(prefix)) shots.push(pair(`${slug}/${prefix}`, prefix))
    }
    const references = (definition.references ?? []).map(reference => `
      <figure><figcaption>${escape(`${reference.platform}: ${reference.description ?? ''}`)}</figcaption>
        <img src="../src/components/${slug}/${reference.image}" alt="">
      </figure>`)
    sections.push(`
  <section id="${slug}">
    <h2>${escape(definition.name)}</h2>
    <div class="row">${shots.join('')}</div>
    ${references.length ? `<h3>The app’s own</h3><div class="row">${references.join('')}</div>` : ''}
  </section>`)
  }

  for (const dir of ['examples', 'pages']) {
    if (!exists(dir)) continue
    const prefixes = fs.globSync('**/*-light.png', { cwd: path.join(out, dir) }).sort().map(file => file.replace(/-light\.png$/, ''))
    sections.push(`
  <section id="${dir}">
    <h2>${dir === 'examples' ? 'Example pages' : 'Pages'}</h2>
    <div class="row">${prefixes.map(prefix => pair(`${dir}/${prefix}`, prefix)).join('')}</div>
  </section>`)
  }

  fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Screenshots</title>
<style>
  body { margin: 24px; font: 16px/1.4 system-ui, sans-serif; background: #f3f2f1; color: #0b0c0c; }
  section { margin-bottom: 48px; }
  .row { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }
  figure { margin: 0; }
  figcaption { margin-bottom: 4px; font-size: 14px; max-width: 480px; }
  .pair { display: flex; gap: 8px; }
  img { max-width: 360px; max-height: 600px; border: 1px solid #b1b4b6; }
</style>
<h1>Screenshots</h1>
<p>Each example in light and dark, then the app’s own screenshots, from the component’s <code>reference/</code> folder.</p>
${sections.join('\n')}
</html>
`)
}
