#!/usr/bin/env node
// Looks through components' files for the rules in AGENTS.md that a script
// can spot: raw colours, spacing off the 8pt grid, selectors on other
// components' classes or bare elements, cascade layers, display: contents on
// a component's element, tokens that don't exist, icons drawn in the font
// without govuk-app-icon, events of a component's own, sources without a
// commit, and the docs site's styles selecting on GOV.UK Frontend's classes.
//
// It finds things to look at, not verdicts: a reviewer reads each one in its
// file and decides. npm run build checks the rest (the schema, the sidebar,
// avoid's elements, the attributes each script reads).
//
//   node .claude/skills/library-review/scripts/check.js --base origin/main
//       what changed since this branch left main, committed or not, only on
//       the lines that changed
//   node .claude/skills/library-review/scripts/check.js status button
//       every line of these components
//
// No dependencies: Node's own modules only, so it runs before npm install.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const exists = file => fs.existsSync(path.join(root, file))

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: { base: { type: 'string' } }
})

// Which lines of which files to report on: every line (true), or a set of
// line numbers, the ones the diff adds or changes.
const scope = new Map()
let components

if (options.base) {
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' })
  const mergeBase = git('merge-base', options.base, 'HEAD').trim()
  // Against the working tree, so uncommitted changes count too.
  let file
  for (const line of git('diff', '-U0', '--no-color', mergeBase).split('\n')) {
    const name = line.match(/^\+\+\+ b\/(.*)/)
    if (name) { file = name[1]; scope.set(file, new Set()); continue }
    const hunk = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/)
    if (hunk && file) {
      const start = Number(hunk[1])
      const count = hunk[2] === undefined ? 1 : Number(hunk[2])
      for (let n = start; n < start + count; n++) scope.get(file).add(n)
    }
  }
  for (const untracked of git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)) {
    scope.set(untracked, true)
  }
  const touched = [...scope.keys()].map(file => file.match(/^components\/([^/]+)\//)?.[1]).filter(Boolean)
  components = [...new Set([...touched, ...positionals])].filter(slug => exists(`components/${slug}/${slug}.json`))
} else {
  components = positionals.length ? positionals : fs.readdirSync(path.join(root, 'components'))
    .filter(slug => exists(`components/${slug}/${slug}.json`))
  for (const slug of components) {
    if (!exists(`components/${slug}/${slug}.json`)) {
      console.error(`There is no component called ${slug}: no components/${slug}/${slug}.json`)
      process.exit(1)
    }
    for (const file of fs.readdirSync(path.join(root, 'components', slug))) scope.set(`components/${slug}/${file}`, true)
  }
  for (const file of fs.globSync('docs/assets/*.scss', { cwd: root })) scope.set(file, true)
}

const inScope = (file, line) => {
  const lines = scope.get(file)
  return lines === true || (lines instanceof Set && (line === undefined || lines.has(line)))
}

const findings = []
const report = (level, file, line, rule, message) => {
  if (inScope(file, line)) findings.push({ level, file, line, rule, message })
}

// The tokens there are: --app-* in foundation/, and what base.css and the
// frame set for every component, such as --govuk-app-inset-top.
const foundation = ['foundation/tokens.css', 'foundation/base.css', 'frame/frame.css'].filter(exists).map(read).join('\n')
const tokens = new Set([...foundation.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map(match => match[1]))

// Every element of the library, to tell another component's classes from a
// longer one of this component's own, such as text's .govuk-app-text-block.
const library = fs.readdirSync(path.join(root, 'components'))
  .filter(slug => exists(`components/${slug}/${slug}.json`))
  .flatMap(slug => {
    const definition = JSON.parse(read(`components/${slug}/${slug}.json`))
    return [definition.element, ...Object.keys(definition.inputs.parts ?? {})]
  })


/* A component */

function checkComponent(slug) {
  const dir = `components/${slug}`
  const definition = JSON.parse(read(`${dir}/${slug}.json`))
  // Its own elements: the component's and its parts', such as
  // govuk-app-grouped-list-row. Its classes are these, and these__part.
  const own = [definition.element, ...Object.keys(definition.inputs.parts ?? {})]

  for (const file of fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.css'))) {
    checkComponentStyles(`${dir}/${file}`, own)
  }
  for (const file of fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.js'))) {
    checkScript(`${dir}/${file}`)
  }
  checkIcons(dir)
  checkDefinition(dir, slug, definition)
}

/**
 * Splits a stylesheet into its rules, each with its selector, its
 * declarations, the line each is on, and whether a comment is in it, just
 * before it, or on a declaration's line: where the why of an odd value goes.
 */
function parseCss(source) {
  const comments = []
  // Comments out, kept the same length so offsets and lines still match.
  const text = source.replace(/\/\*[\s\S]*?\*\//g, (comment, offset) => {
    comments.push([offset, offset + comment.length])
    return comment.replace(/[^\n]/g, ' ')
  })
  const lineAt = offset => source.slice(0, offset).split('\n').length
  const commentLines = new Set(comments.flatMap(([start, end]) => {
    const lines = []
    for (let n = lineAt(start); n <= lineAt(end); n++) lines.push(n)
    return lines
  }))
  const rules = []
  const atRules = []
  const stack = []
  let start = 0
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '{') {
      const prelude = text.slice(start, i).trim()
      const preludeStart = start + text.slice(start, i).search(/\S/)
      const parent = stack.at(-1)
      const frame = { prelude, start: preludeStart, open: i, declarations: [] }
      if (prelude.startsWith('@')) {
        atRules.push({ prelude, line: lineAt(preludeStart) })
        frame.at = prelude.match(/^@([a-z-]+)/)[1]
      } else if (parent?.at === 'keyframes' || parent?.at === 'font-face' || parent?.skip) {
        frame.skip = true
      } else {
        frame.rule = true
      }
      if (frame.at === 'keyframes' || frame.at === 'font-face') frame.skip = true
      stack.push(frame)
      start = i + 1
    } else if (char === ';' || char === '}') {
      const chunk = text.slice(start, i)
      const frame = stack.at(-1)
      if (chunk.trim() && frame) {
        const offset = start + chunk.search(/\S/)
        const [property, ...value] = chunk.trim().split(':')
        if (value.length) frame.declarations.push({ property: property.trim().toLowerCase(), value: value.join(':').trim(), line: lineAt(offset) })
      }
      if (char === '}' && stack.length) {
        const frame = stack.pop()
        if (frame.rule) {
          const first = lineAt(frame.start)
          const last = lineAt(i)
          // A comment inside the rule, or ending on the line before it.
          const commented = [...commentLines].some(n => n >= first - 1 && n <= last)
          rules.push({ selector: frame.prelude, line: first, declarations: frame.declarations, commented, commentLines })
        }
      }
      start = i + 1
    }
  }
  const commentText = comments.map(([start, end]) => source.slice(start, end)).join("\n")
  return { rules, atRules, commentText }
}

const spacing = /^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(-|$)/
const colourProperty = /^(color|background|border|outline|box-shadow|text-shadow|fill|stroke|caret-color|accent-color|text-decoration|column-rule)/
const namedColours = /\b(white|black|red|green|blue|yellow|orange|purple|pink|grey|gray|silver|navy|teal)\b/i

function checkComponentStyles(file, own) {
  const { rules, atRules, commentText } = parseCss(read(file))

  for (const at of atRules) {
    if (/^@layer\b/.test(at.prelude)) {
      report('must', file, at.line, 'Styles: no cascade layers', `\`${at.prelude}\`: a component's styles go in no layer, so a page's layered styles can't win over them.`)
    }
    if (/^@import\b/.test(at.prelude)) {
      report('must', file, at.line, 'Icons: load fonts with defineComponent', `\`${at.prelude}\`: load a font with \`fonts: [...]\` in defineComponent, not @import, as the component waits for its stylesheet.`)
    }
  }

  for (const rule of rules) {
    checkSelector(file, rule, own)

    for (const { property, value, line } of rule.declarations) {
      const explained = rule.commented || rule.commentLines.has(line)

      if (property === 'display' && /\bcontents\b/.test(value) && targetsElement(rule.selector, own)) {
        report('must', file, line, 'Styles: no display: contents', `\`display: contents\` on \`${rule.selector}\`: component.js already sets it on every component's element.`)
      }

      if (!property.startsWith('--') && !/^(mask|-webkit-mask|content|font-family)/.test(property)) {
        const unwrapped = value.replace(/url\([^)]*\)/g, '').replace(/"[^"]*"|'[^']*'/g, '').replace(/var\(--[a-z0-9-]+/gi, 'var(')
        const hex = unwrapped.match(/#[0-9a-f]{3,8}\b/i)
        const fn = unwrapped.match(/\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i)
        const named = colourProperty.test(property) && unwrapped.match(namedColours)
        const raw = hex?.[0] ?? (fn && `${fn[1]}()`) ?? named?.[0]
        if (raw) {
          report('must', file, line, 'Styles: --app-* tokens only', `\`${property}: ${value}\` uses a raw colour, ${raw}. Use an --app-* token from foundation/tokens.css, adding one there (naming where it comes from) if none fits. Tokens give light and dark.`)
        }
      }

      if (spacing.test(property)) {
        // Not inside a var()'s fallback, such as var(--govuk-app-inset-top, 0px).
        const bare = value.replace(/var\([^()]*\)/g, '')
        for (const match of bare.matchAll(/(-?\d*\.?\d+)px\b/g)) {
          const px = Math.abs(Number(match[1]))
          // A hairline, such as the room a 0.33pt divider takes, isn't spacing.
          if (px < 2) continue
          // Or one a comment anywhere in the file names, such as a header
          // saying "10pt from the bottom".
          const named = explained || new RegExp(`(^|[^\\d.])${px}(pt|px)`).test(commentText)
          if ([4, 8, 16, 24, 32].includes(px)) {
            report('should', file, line, 'Styles: spacing tokens', `\`${property}: ${value}\`: ${match[0]} is on the grid, so use its token, --app-space-* (4, 8, 16, 24, 32).`)
          } else if (px % 4 === 0) {
            if (!named) report('look', file, line, 'Styles: spacing tokens', `\`${property}: ${value}\`: ${match[0]} is on the grid, but raw. Could it be a calc() of --app-space-* tokens, as status.css makes 12pt?`)
          } else if (!named) {
            report('must', file, line, 'Styles: 8pt grid', `\`${property}: ${value}\`: ${match[0]} is off the 8pt grid, with no comment saying why. Use --app-space-* tokens, or, if the app itself has this value, say so in a comment, as button.css does with GovKit's 13pt.`)
          } else if (px % 4 !== 0) {
            report('look', file, line, 'Styles: 8pt grid', `\`${property}: ${value}\`: ${match[0]} is off the grid. There's a comment by it: check it says the app has this value, and where from.`)
          }
        }
      }

      // An icon's size is the glyph's, not type, so not those in the icon font.
      const icon = rule.declarations.some(d => d.property === 'font-family' && /Material Symbols/.test(d.value))
      if (/^(font-size|font-weight|line-height)$/.test(property) && /\d(px|pt|rem|em)?\b/.test(value) && !/var\(/.test(value) && !explained && !icon) {
        if (!(property === 'line-height' && value === '1') && !(property === 'font-weight' && value === 'normal')) {
          report('look', file, line, 'Styles: --app-* tokens only', `\`${property}: ${value}\`: type comes from --app-font-* tokens. If the app really has this value, say why in a comment.`)
        }
      }

      for (const match of value.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
        const name = match[1]
        const declaredHere = rules.some(other => other.declarations.some(d => d.property === name))
        if (name.startsWith('--app-') && !tokens.has(name)) {
          report('must', file, line, 'Styles: --app-* tokens only', `${name} isn't in foundation/tokens.css. Add it there, naming where it comes from, or use one that is.`)
        } else if (!name.startsWith('--app-') && !tokens.has(name) && !declaredHere) {
          report('should', file, line, 'Styles: --app-* tokens only', `${name} isn't an --app-* token, and nothing in this stylesheet sets it.`)
        }
      }

      if (property === 'font-family' && /\bSF\b|SF Symbols|SF Pro/i.test(value)) {
        report('must', file, line, 'Icons: Material Symbols, never SF Symbols', `\`font-family: ${value}\`: SF Symbols may only be used on Apple's platforms. Use Material Symbols.`)
      }
    }
  }
}

/** Does the selector style the component's own element, the custom one? */
function targetsElement(selector, own) {
  return selector.split(',').some(part => {
    const last = part.trim().split(/[\s>+~]+/).at(-1)
    return own.some(element => last === element || last.startsWith(`${element}:`) || last.startsWith(`${element}[`))
  })
}

/**
 * A component styles only its own classes, govuk-app-NAME and
 * govuk-app-NAME__part, and its own elements. Never another component's
 * classes, the foundation's, or a bare element.
 */
function checkSelector(file, rule, own) {
  // Its own: an element's name, or that and __part, --modifier or -more,
  // unless the longer name is another component's, such as button-stack's
  // for button.
  const starts = (name, element) => name === element || name.startsWith(`${element}__`) || name.startsWith(`${element}-`)
  const others = library.filter(element => !own.includes(element))
  const isOwnClass = name => own.some(element => starts(name, element)) &&
    !others.some(element => starts(name, element) && !own.some(mine => mine.length >= element.length && starts(name, mine)))
  for (const [, name] of rule.selector.matchAll(/\.([a-z0-9_-]+)/gi)) {
    if (!isOwnClass(name)) {
      const whose = name.startsWith('govuk-app-') ? 'another component\'s, or the foundation\'s' : 'not one of the library\'s'
      report('must', file, rule.line, 'Styles: own classes only', `\`${rule.selector}\` selects .${name}, which is ${whose}. A component styles only its own classes (${own.map(element => `.${element}`).join(', ')}, and their __parts).`)
    }
  }
  // Anything in brackets set aside first, such as :is(a, button) after a
  // class, so its commas don't split the selector.
  const flat = rule.selector.replace(/\([^()]*\)/g, '()').replace(/\([^()]*\)/g, '()').replace(/\[[^\]]*\]/g, '[]')
  for (const part of flat.split(',')) {
    // Each compound selector.
    for (const compound of part.trim().split(/\s*[\s>+~]\s*/).filter(Boolean)) {
      const type = compound.match(/^([a-z][a-z0-9-]*)/i)?.[1]
      if (!type) continue
      if (own.includes(type)) continue
      if (type.startsWith('govuk-app-') || type === 'govuk-app') {
        report('must', file, rule.line, 'Styles: own classes only', `\`${part.trim()}\` selects <${type}>, which isn't this component's. Style only its own elements and classes.`)
      } else if (!/\.[a-z]/i.test(compound)) {
        report('must', file, rule.line, 'Styles: never a bare element', `\`${part.trim()}\` styles a bare <${type}>. Give it a class of this component's own, such as .${own[0]}__${type === 'a' ? 'link' : type}, and style that.`)
      }
    }
  }
}

/** Components send no events of their own, and draw into the light DOM. */
function checkScript(file) {
  read(file).split('\n').forEach((text, index) => {
    const line = index + 1
    if (/new\s+CustomEvent\b/.test(text)) {
      report('must', file, line, 'Markup and JS: no events of its own', 'A CustomEvent: components send no events of their own. Draw a real link, button or field, and let its events bubble.')
    } else if (/\.dispatchEvent\(/.test(text)) {
      report('look', file, line, 'Markup and JS: no events of its own', 'dispatchEvent: fine if it re-sends a real field\'s own event, as the search field does with input when it clears; not if it\'s an event of the component\'s own.')
    }
    if (/attachShadow\(/.test(text)) {
      report('must', file, line, 'Markup and JS: light DOM', 'attachShadow: components are drawn in the light DOM, from their template, by foundation/component.js.')
    }
    if (/customElements\.define\(/.test(text)) {
      report('should', file, line, 'Markup and JS: component.js template', 'customElements.define: define it with defineComponent, from foundation/component.js, which draws it from its template.')
    }
    if (/\.innerHTML\s*=|insertAdjacentHTML/.test(text)) {
      report('look', file, line, 'Markup and JS: component.js template', 'Writes HTML from script: the markup belongs in the component\'s template, filled in with data-text, data-attr, data-if and data-slot.')
    }
  })
}

/**
 * An element drawn in the icon font has govuk-app-icon too, so it's hidden
 * until the font has loaded, and the script loads the font.
 */
function checkIcons(dir) {
  const css = fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.css'))
  const html = fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.html'))
  const js = fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.js'))
  const templates = html.map(file => [`${dir}/${file}`, read(`${dir}/${file}`)])
  let usesFont = false
  for (const file of css) {
    const { rules } = parseCss(read(`${dir}/${file}`))
    for (const rule of rules) {
      const font = rule.declarations.find(d => d.property === 'font-family' && /Material Symbols/.test(d.value))
      if (!font) continue
      usesFont = true
      for (const [, name] of rule.selector.matchAll(/\.([a-z0-9_-]+)/gi)) {
        for (const [template, source] of templates) {
          source.split('\n').forEach((text, index) => {
            const classes = text.match(/class="([^"]*)"/)?.[1].split(/\s+/) ?? []
            if (classes.includes(name) && !classes.includes('govuk-app-icon')) {
              report('should', template, index + 1, 'Icons: govuk-app-icon', `.${name} is drawn in ${font.value}, but hasn't the class govuk-app-icon as well, so it shows as its name until the font loads.`)
            }
          })
        }
      }
    }
  }
  if (usesFont && !js.some(file => /fonts\s*[:,]/.test(read(`${dir}/${file}`)))) {
    const file = `${dir}/${js[0]}`
    report('must', file, undefined, 'Icons: load fonts with defineComponent', 'Its styles use Material Symbols, but its script doesn\'t load the font: pass fonts: [materialSymbols] to defineComponent.')
  }
}

/** What a script can check in a definition beyond the schema and the build. */
function checkDefinition(dir, slug, definition) {
  const file = `${dir}/${slug}.json`
  const source = read(file)
  const lineOf = needle => {
    const index = source.indexOf(needle)
    return index < 0 ? undefined : source.slice(0, index).split('\n').length
  }
  // Report a definition's findings if anything in its folder changed.
  const any = [...scope.keys()].some(changed => changed.startsWith(`${dir}/`))
  const say = (level, line, rule, message) => {
    if (any) findings.push({ level, file, line, rule, message })
  }

  for (const platform of ['ios', 'android']) {
    for (const entry of definition.sources[platform]) {
      if (!entry.ref) {
        say('must', lineOf(`"${entry.path}"`), 'Definition: sources pinned to a commit', `The ${platform} source ${entry.path} has no ref: give the commit you read it at, so others can see what you saw.`)
      }
    }
  }
  if (!definition.proposed && !definition.sources.ios.length && !definition.sources.android.length && definition.origin.kind === 'govuk') {
    say('should', lineOf('"sources"'), 'Definition: origin and sources', 'A GOV.UK app component that\'s in the app, with no iOS or Android source. Say where in the app it comes from, or mark it proposed.')
  }

  const references = definition.references ?? []
  for (const reference of references) {
    if (!exists(`${dir}/${reference.image}`)) {
      say('must', lineOf(`"${reference.image}"`), 'Definition: references', `${reference.image} is listed, but isn't in ${dir}/.`)
    }
  }
  if (exists(`${dir}/reference`)) {
    const listed = new Set(references.map(reference => reference.image))
    for (const image of fs.readdirSync(path.join(root, dir, 'reference'))) {
      if (!listed.has(`reference/${image}`)) {
        say('look', undefined, 'Definition: references', `reference/${image} is in the folder, but not in the definition's references, so the docs don't show it.`)
      }
    }
  }
  if (!definition.proposed && !references.length) {
    say('look', lineOf('"sources"'), 'Definition: references', 'No references: screenshots of the app\'s own component, in reference/, to compare it with. Fine for one the app draws with the platform\'s own, such as a link; otherwise add some.')
  }
  if (definition.proposed && !definition.sources.figma.length) {
    say('look', lineOf('"proposed"'), 'Definition: proposed', 'Proposed, with no link in sources.figma. Fine until there\'s a link to the design; add it once there is.')
  }

  for (const avoid of definition.avoid) {
    if (/^govuk-app-/.test(avoid.instead)) continue
    // Words, which the build doesn't check. Worth a look if they name an
    // element without being one, which the build would miss.
    if (/govuk-app-[a-z-]+/.test(avoid.instead)) {
      say('look', lineOf(avoid.instead.slice(0, 40)), 'Definition: avoid', `instead, "${avoid.instead}", names an element inside words, so the build can't check it or link to it. Write just the element, with any attributes, where that's what to use.`)
    }
  }

  const prose = `${dir}/${slug}.md`
  const differences = exists(prose) && /^##\s+Known differences/m.test(read(prose))
  if (!differences && (scope.has(file) || scope.has(prose))) {
    say('look', undefined, 'Definition: known differences', `No "Known differences from the app" in ${slug}.md. Fine if it matches the app (or, if proposed, its design) exactly; otherwise say where it differs.`)
  }
}

/* The docs site */

function checkDocsStyles(file) {
  const source = read(file).replace(/\/\/[^\n]*/g, line => line.replace(/./g, ' '))
  const { rules } = parseCss(source)
  for (const rule of rules) {
    for (const [, name] of rule.selector.matchAll(/\.((?:x-govuk|govuk|app)-[a-z0-9_-]+)/gi)) {
      report('must', file, rule.line, 'Docs site: docs- classes only', `\`${rule.selector}\` selects .${name}, a class of GOV.UK Frontend's or the Eleventy plugin's. Add a docs- class to the element and style that.`)
    }
  }
}

/* Output */

function print() {
  const order = { must: 0, should: 1, look: 2 }
  const headings = { must: 'Must fix', should: 'Should fix', look: 'Worth a look' }
  const unique = [...new Map(findings.map(f => [`${f.file}:${f.line}:${f.message}`, f])).values()]
  if (!unique.length) {
    console.log(`Nothing found in ${components.length ? components.join(', ') : 'the changed files'}. This script sees only some of the rules: read the diff against references/checklist.md too.`)
    return
  }
  for (const level of Object.keys(order)) {
    const group = unique.filter(f => f.level === level)
      .sort((a, b) => a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0))
    if (!group.length) continue
    console.log(`\n${headings[level]} (${group.length})\n`)
    for (const f of group) console.log(`  ${f.file}${f.line ? `:${f.line}` : ''}\n    [${f.rule}] ${f.message}`)
  }
  console.log('\nThese are leads, not verdicts: read each in its file before reporting it.')
}

/* Run, once everything above is defined */

for (const slug of components) checkComponent(slug)
for (const file of [...scope.keys()].filter(file => /^docs\/.*\.s?css$/.test(file) && exists(file))) checkDocsStyles(file)

print()
