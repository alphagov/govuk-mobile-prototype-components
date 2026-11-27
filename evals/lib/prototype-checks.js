// The code checks on a prototype a whole task made: with this repository's
// Playwright, as the evals run from here. Each check passes or fails with a
// reason a person can read.
//
//   Pages load      every screen in prototype.json, and every page in
//                   screens/, with no script failing, no error in the
//                   console, and nothing missing
//   Elements        every govuk-* element is the library's, or defined by a
//                   component of the prototype's own in components/
//   Links           every link inside the app goes to a page that's there
//   Journey         a scripted click-through, from the case, remembered
//                   answers too
//   Styles          a custom component's CSS, and any styles on a screen,
//                   use only --app-* tokens, on the 8pt grid
//   Required parts  what the case says must be on some page, and mustn't

import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

import { chromium } from 'playwright'

import { walk } from './util.js'

/** Starts the prototype's own server, and resolves with its address. */
function startServer(dir) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], { cwd: dir, env: { ...process.env, PORT: String(4300 + Math.floor(Math.random() * 400)) }, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    const listen = chunk => {
      output += chunk
      const port = output.match(/http:\/\/localhost:(\d+)/)?.[1]
      if (port) resolve({ base: `http://localhost:${port}`, close: () => child.kill() })
    }
    child.stdout.on('data', listen)
    child.stderr.on('data', chunk => { output += chunk })
    child.on('exit', () => reject(new Error(`The prototype wouldn't start: ${output.trim()}`)))
    setTimeout(() => reject(new Error('The prototype took too long to start')), 20_000).unref()
  })
}

/** Every element name the library has, from its catalogue, and the page's own. */
function libraryElements(dir) {
  const catalogue = JSON.parse(fs.readFileSync(path.join(dir, 'node_modules', 'govuk-mobile-prototype-components', 'catalogue', 'catalogue.json'), 'utf8'))
  const names = new Set(['govuk-app', 'govuk-prototype-frame'])
  for (const component of catalogue.components ?? []) {
    if (component.element) names.add(component.element)
    for (const part of Object.keys(component.inputs?.parts ?? component.parts ?? {})) names.add(part)
  }
  // Belt and braces: the elements the package's scripts define.
  const src = path.join(dir, 'node_modules', 'govuk-mobile-prototype-components', 'src')
  for (const file of walk(src, file => file.endsWith('.json') && file.startsWith('components'))) {
    try {
      const definition = JSON.parse(fs.readFileSync(path.join(src, file), 'utf8'))
      if (definition.element) names.add(definition.element)
      for (const part of Object.keys(definition.inputs?.parts ?? {})) names.add(part)
    } catch {}
  }
  return names
}

/** The prototype's own components: the element names their scripts define. */
function customElements(dir) {
  const names = new Map()
  for (const file of walk(path.join(dir, 'components'), file => file.endsWith('.js'))) {
    const source = fs.readFileSync(path.join(dir, 'components', file), 'utf8')
    for (const match of source.matchAll(/name:\s*['"]([a-z0-9-]+)['"]/g)) names.set(`govuk-app-${match[1].replace(/^govuk-app-/, '')}`, file)
    for (const match of source.matchAll(/customElements\.define\(\s*['"]([a-z0-9-]+)['"]/g)) names.set(match[1], file)
  }
  return names
}

/** Raw colours and spacing off the grid, in a stylesheet's text. */
export function styleProblems(css, where) {
  const problems = []
  const comments = (css.match(/\/\*[\s\S]*?\*\//g) ?? []).join('\n')
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  for (const declaration of text.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/gi)) {
    const [, property, raw] = declaration
    if (property.startsWith('--') || /^(content|font-family|mask|-webkit-mask)/.test(property)) continue
    const value = raw.replace(/var\([^()]*\)/g, 'var()').replace(/url\([^)]*\)/g, '')
    const colour = value.match(/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|lab)\(|\b(white|black|red|green|blue|grey|gray|yellow)\b/i)
    if (colour && /^(color|background|border|outline|box-shadow|fill|stroke|text-decoration)/.test(property)) {
      problems.push(`${where}: ${property}: ${raw.trim()} uses a raw colour, not an --app-* token`)
    }
    if (/^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(-|$)/.test(property)) {
      for (const px of value.matchAll(/(\d*\.?\d+)px/g)) {
        const n = Number(px[1])
        if (n >= 2 && n % 4 !== 0 && !new RegExp(`(^|\\D)${n}(pt|px)`).test(comments)) {
          problems.push(`${where}: ${property}: ${raw.trim()} is off the 8pt grid, with no comment saying why`)
        }
      }
    }
  }
  return problems
}

export async function checkPrototype(dir, expectations = {}) {
  const checks = []
  const add = (name, problems, detail = '') => checks.push({ name, pass: !problems.length, problems: problems.slice(0, 12), more: Math.max(0, problems.length - 12), detail })

  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'prototype.json'), 'utf8'))
  const listed = (manifest.screens ?? []).map(screen => screen.path)
  const pages = [...new Set([...listed, ...walk(path.join(dir, 'screens'), file => file.endsWith('.html')).map(file => `/screens/${file}`)])]

  const server = await startServer(dir)
  const browser = await chromium.launch()
  const known = libraryElements(dir)
  const custom = customElements(dir)
  const found = { load: [], elements: [], links: [], styles: [] }
  const linkTargets = new Set()
  const requires = (expectations.requires ?? []).map(rule => ({ rule, count: 0 }))
  const forbidden = []
  try {
    const context = await browser.newContext({ viewport: { width: 470, height: 1000 } })
    // The server's live reload holds a connection open for each page, and a
    // browser opens only six to a host: nothing here needs it.
    // A 204 tells an EventSource to stop, quietly. And nothing leaves this
    // computer, such as a link to a council's website pressed by mistake.
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (url.hostname !== 'localhost') return route.abort()
      if (url.pathname === '/__reload') return route.fulfill({ status: 204 })
      return route.continue()
    })
    for (const page of pages) {
      const tab = await context.newPage()
      const problems = []
      tab.on('pageerror', error => problems.push(`a script failed: ${error.message.split('\n')[0]}`))
      tab.on('console', message => {
        if (message.type() === 'error' && !/__reload/.test(message.location()?.url ?? '')) problems.push(`the console said: ${message.text().slice(0, 160)}`)
      })
      tab.on('response', response => { if (response.status() >= 400 && !response.url().endsWith('favicon.ico')) problems.push(`${new URL(response.url()).pathname} isn't there (${response.status()})`) })
      try {
        await tab.goto(server.base + page, { waitUntil: 'load', timeout: 20_000 })
        await tab.waitForTimeout(600)
        const info = await tab.evaluate(() => ({
          elements: [...new Set([...document.querySelectorAll('*')].map(element => element.localName).filter(name => name.startsWith('govuk-')))],
          undefinedElements: [...new Set([...document.querySelectorAll('*')].map(element => element.localName).filter(name => name.startsWith('govuk-') && name !== 'govuk-app' && !customElements.get(name)))],
          links: [...document.querySelectorAll('govuk-app a[href]')].map(link => link.href).filter(href => href.startsWith(location.origin))
        }))
        for (const name of info.undefinedElements) problems.push(`<${name}> isn't drawn: its script isn't loaded, or there's no such element`)
        for (const name of info.elements) {
          if (!known.has(name) && !custom.has(name)) found.elements.push(`${page}: <${name}> isn't one of the library's elements, nor defined in components/`)
        }
        for (const link of info.links) linkTargets.add(`${page} → ${new URL(link).pathname}`)

        // Required and forbidden parts, on this page.
        for (const entry of requires) {
          if (entry.rule.page && !page.includes(entry.rule.page)) continue
          const matches = tab.locator(entry.rule.selector)
          entry.count += await (entry.rule.text ? matches.filter({ hasText: new RegExp(entry.rule.text, 'i') }) : matches).count().catch(() => 0)
        }
        for (const rule of expectations.forbids ?? []) {
          if (rule.page && !page.includes(rule.page)) continue
          if (rule.withSelector && !(await tab.locator(rule.withSelector).count())) continue
          if (await tab.locator(rule.selector).count().catch(() => 0)) forbidden.push(`${page} has ${rule.selector}: ${rule.why ?? ''}`.trim())
        }
      } catch (error) {
        problems.push(`didn't load: ${error.message.split('\n')[0]}`)
      }
      await tab.close().catch(() => {})
      for (const problem of new Set(problems)) found.load.push(`${page}: ${problem}`)
    }
    for (const entry of linkTargets) {
      const target = entry.split(' → ')[1]
      const response = await fetch(server.base + target).catch(() => null)
      if (!response?.ok) found.links.push(`${entry}, which isn't there`)
    }

    add('Pages load', found.load, `${pages.length} pages`)
    add('Elements are the library\'s, or custom in components/', found.elements, custom.size ? `custom: ${[...custom.keys()].join(', ')}` : 'no custom components')
    add('Links go somewhere', found.links, `${linkTargets.size} links`)

    // Styles of the prototype's own.
    for (const file of walk(path.join(dir, 'components'), file => file.endsWith('.css'))) {
      found.styles.push(...styleProblems(fs.readFileSync(path.join(dir, 'components', file), 'utf8'), `components/${file}`))
    }
    for (const file of walk(path.join(dir, 'screens'), file => file.endsWith('.html'))) {
      const html = fs.readFileSync(path.join(dir, 'screens', file), 'utf8')
      for (const style of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) found.styles.push(...styleProblems(style[1], `screens/${file}`))
      // Styles written on the page, inside the app: from the source, as
      // components and prototype.js set styles of their own as they run.
      const app = html.match(/<govuk-app[\s>][\s\S]*<\/govuk-app>/)?.[0] ?? ''
      const inline = (app.match(/\sstyle\s*=/g) ?? []).length + (app.match(/<style[\s>]/g) ?? []).length
      if (inline) found.styles.push(`screens/${file}: ${inline} style(s) written inside <govuk-app>, which the app's own screens never need`)
    }
    add('Custom styles use only tokens, on the grid', found.styles)

    const required = [
      ...requires.filter(entry => entry.count < (entry.rule.min ?? 1)).map(({ rule, count }) => `${count ? `only ${count} match` : 'nothing matches'} ${rule.selector}${rule.text ? ` with /${rule.text}/` : ''}${rule.page ? ` on ${rule.page}` : ''}: ${rule.why ?? ''}`.trim()),
      ...forbidden
    ]
    if (requires.length || (expectations.forbids ?? []).length) add('Required parts are there', required)


    // The journey, clicked through in a tab of its own.
    if (expectations.journey?.length) {
      const tab = await context.newPage()
      const problems = []
      const steps = []
      try {
        await journey(tab, server.base, expectations.journey, manifest, steps)
      } catch (error) {
        problems.push(error.message)
      }
      add('The journey works, clicked through', problems, steps.join(' → '))
    }
  } finally {
    await browser.close()
    server.close()
  }
  return checks
}

/**
 * Whether someone could use it: visible, and not behind a sheet, where the
 * screen underneath is still drawn but inert.
 */
async function usable(element) {
  return (await element.isVisible().catch(() => false)) &&
    !(await element.evaluate(node => Boolean(node.closest('[inert]'))).catch(() => true))
}

/** The first link or button someone could press whose name matches. */
async function control(tab, pattern) {
  const name = new RegExp(pattern, 'i')
  for (const role of ['link', 'button', 'menuitem', 'switch', 'radio', 'checkbox']) {
    const candidates = tab.getByRole(role, { name })
    const count = await candidates.count()
    for (let i = 0; i < count; i++) {
      const candidate = candidates.nth(i)
      if (await usable(candidate)) return candidate
    }
  }
  // A row drawn as a link whose text is its name.
  const text = tab.locator('govuk-app a, govuk-app button, govuk-app label').filter({ hasText: name })
  for (let i = 0; i < await text.count(); i++) {
    if (await usable(text.nth(i))) return text.nth(i)
  }
  return null
}

/** Whether the words are on the screen someone sees: not hidden, and not behind a sheet. */
async function showsText(tab, pattern) {
  const matches = tab.getByText(new RegExp(pattern, 'i'))
  for (let i = 0; i < await matches.count(); i++) {
    if (await usable(matches.nth(i))) return true
  }
  return false
}

async function settle(tab) {
  await tab.waitForLoadState('load').catch(() => {})
  await tab.waitForTimeout(500)
}

async function textField(tab) {
  // A question's field, not a search box, such as Home's, which is always there.
  const fields = tab.locator('govuk-app input[type="text"], govuk-app input:not([type]), govuk-app input[type="tel"], govuk-app input[type="email"], govuk-app input[type="number"], govuk-app textarea')
  for (let i = 0; i < await fields.count(); i++) {
    if (await usable(fields.nth(i))) return fields.nth(i)
  }
  return null
}

/**
 * Steps, from the case:
 *   { "goto": "/screens/settings/index.html" }   or "first-new" for the first screen
 *                                                 added to prototype.json
 *   { "click": "notifications" }                   a link, button or menu item by its name
 *   { "fill": "AB12 CDE" }                         the visible text field
 *   { "expectText": "AB12 CDE" }                   on the screen now
 *   { "expectField": true }                        a text field on the screen now
 *   { "expectPath": "/screens/home/" }             the address now starts with this
 *   { "expectNotPath": "/screens/home/" }          and doesn't
 *   { "check": "benefits" }                        turn on the switch with this name
 *   { "expectChecked": "benefits" }                and see it's on, such as after
 *                                                 coming back to the screen
 *   { "until": "AB12 CDE", "or": "field", "clicking": ["continue", "next"], "max": 4 }
 *                                                 click the first of these that's
 *                                                 there until the text (or a field)
 *                                                 shows
 */
async function journey(tab, base, steps, manifest, said) {
  for (const step of steps) {
    if (step.goto) {
      const target = step.goto === 'first-new' ? firstNew(manifest) : step.goto
      if (!target) throw new Error('there\'s no new screen in prototype.json to start from')
      await tab.goto(base + target)
      await settle(tab)
      said.push(`open ${target}`)
    } else if (step.click) {
      const button = await control(tab, step.click)
      if (!button) throw new Error(`on ${new URL(tab.url()).pathname}, there's nothing to press called /${step.click}/`)
      await button.click()
      await settle(tab)
      said.push(`press /${step.click}/`)
    } else if (step.fill) {
      const field = await textField(tab)
      if (!field) throw new Error(`on ${new URL(tab.url()).pathname}, there's no text field to type ${step.fill} into`)
      await field.fill(step.fill)
      said.push(`type ${step.fill}`)
    } else if (step.expectText) {
      const shown = await showsText(tab, step.expectText)
      if (!shown) throw new Error(`${new URL(tab.url()).pathname} doesn't show /${step.expectText}/`)
      said.push(`see /${step.expectText}/`)
    } else if (step.expectPath || step.expectNotPath) {
      const now = new URL(tab.url()).pathname
      if (step.expectPath && !now.startsWith(step.expectPath)) throw new Error(`ended on ${now}, not in ${step.expectPath}`)
      if (step.expectNotPath && now.startsWith(step.expectNotPath)) throw new Error(`went to ${now}, which it shouldn't yet`)
      said.push(step.expectPath ? `be in ${step.expectPath}` : `not be in ${step.expectNotPath}`)
    } else if (step.check || step.expectChecked) {
      const name = new RegExp(step.check ?? step.expectChecked, 'i')
      const toggle = tab.getByRole('switch', { name }).or(tab.getByRole('checkbox', { name })).first()
      if (!(await toggle.count())) throw new Error(`on ${new URL(tab.url()).pathname}, there's no switch called /${name.source}/`)
      if (step.check) {
        if (!(await toggle.isChecked())) await toggle.click()
        await tab.waitForTimeout(300)
        said.push(`turn on /${name.source}/`)
      } else {
        if (!(await toggle.isChecked())) throw new Error(`/${name.source}/ wasn't still on when the screen was opened again`)
        said.push(`see /${name.source}/ still on`)
      }
    } else if (step.expectField) {
      if (!(await textField(tab))) throw new Error(`${new URL(tab.url()).pathname} has no text field`)
      said.push('see a text field')
    } else if (step.until) {
      let done = false
      for (let i = 0; i <= (step.max ?? 4) && !done; i++) {
        const shown = step.until === 'field'
          ? Boolean(await textField(tab))
          : await showsText(tab, step.until)
        if (shown) {
          done = true
          break
        }
        let pressed = false
        for (const name of step.clicking) {
          const button = await control(tab, name)
          if (button) {
            await button.click()
            await settle(tab)
            said.push(`press /${name}/`)
            pressed = true
            break
          }
        }
        if (!pressed) break
      }
      if (!done) throw new Error(`didn't reach /${step.until}/ by pressing ${step.clicking.map(name => `/${name}/`).join(' or ')} (stuck on ${new URL(tab.url()).pathname})`)
      said.push(`reach /${step.until}/`)
    }
  }
}

function firstNew(manifest) {
  const starters = /^\/screens\/(settings|home|chat)\//
  return (manifest.screens ?? []).map(screen => screen.path).find(screen => !starters.test(screen))
}
