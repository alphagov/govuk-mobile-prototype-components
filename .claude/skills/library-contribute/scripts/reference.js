#!/usr/bin/env node
// Finds the app's own screenshots of a component, in its snapshot tests, and
// copies one into a component's reference/ folder as WebP, as the library
// keeps them.
//
//   node .claude/skills/library-contribute/scripts/reference.js find divider
//       every snapshot image, in the three app repos at the head of main,
//       whose path mentions "divider", with the commit each was found at
//   node .claude/skills/library-contribute/scripts/reference.js find divider --ref feature/dwp-benefits --repo ios-app
//       the same, on a branch, in one repo
//   node .claude/skills/library-contribute/scripts/reference.js fetch \
//       govuk-once/govuk-mobile-ios-app@3813aa2a:Tests/.../test_x@3x.png \
//       src/components/divider/reference/ios-divider.webp [--crop x,y,w,h]
//       downloads one, at that commit, crops it if asked (in the image's own
//       pixels), and writes it as WebP
//
// Uses gh, signed in, for GitHub, and the Chromium Playwright installed for
// npm run screenshots to turn PNG into WebP: macOS's sips can't write WebP.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

const repos = {
  'ios-app': 'govuk-once/govuk-mobile-ios-app',
  'ios-gov-kit': 'govuk-once/govuk-mobile-ios-gov-kit',
  'android-app': 'govuk-once/govuk-mobile-android-app'
}

// Where each repo keeps its snapshot tests' images: iOS's
// ReferenceImages_64/<Test>/<test>@3x.png, and Android's
// <module>/src/screenshotTestDebug/reference/<package>/<Test>/<Preview>.png.
const snapshot = /(ReferenceImages[^/]*|screenshotTest[A-Za-z]*\/reference)\/.*\.png$/

const { values: options, positionals: [command, ...rest] } = parseArgs({
  allowPositionals: true,
  options: {
    ref: { type: 'string', default: 'main' },
    repo: { type: 'string' },
    crop: { type: 'string' },
    dark: { type: 'boolean' }
  }
})

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })

if (command === 'find' && rest.length) {
  const terms = rest.map(term => term.toLowerCase())
  const which = options.repo ? [repos[options.repo] ?? options.repo] : Object.values(repos)
  for (const repo of which) {
    let sha
    try {
      sha = gh('api', `repos/${repo}/commits/${encodeURIComponent(options.ref)}`, '--jq', '.sha').trim().slice(0, 8)
    } catch {
      console.log(`${repo}: no ${options.ref} here`)
      continue
    }
    const tree = JSON.parse(gh('api', `repos/${repo}/git/trees/${sha}?recursive=1`))
    const found = tree.tree
      .filter(entry => entry.type === 'blob' && snapshot.test(entry.path))
      .filter(entry => terms.every(term => entry.path.toLowerCase().includes(term)))
      // Light first, unless asked for dark: the library compares both, but
      // the references it keeps are mostly light.
      .filter(entry => options.dark || !/dark/i.test(entry.path.split('/').pop()))
    console.log(`\n${repo}@${sha} (${options.ref}): ${found.length} found${tree.truncated ? '. The tree was too big to list whole, so some may be missing: search a narrower --ref or path with gh' : ''}`)
    for (const entry of found.slice(0, 40)) console.log(`  ${repo}@${sha}:${entry.path}`)
    if (found.length > 40) console.log(`  … and ${found.length - 40} more: add a word to narrow it`)
  }
} else if (command === 'fetch' && rest.length === 2) {
  const [source, out] = rest
  const match = source.match(/^([^@/]+\/[^@]+)@([^:]+):(.+)$/)
  let png, file, ref
  if (fs.existsSync(source)) {
    // A screenshot on this computer, such as one of a design.
    file = source
    png = fs.readFileSync(source)
  } else if (match) {
    let repo
    ;[, repo, ref, file] = match
    const encoded = file.split('/').map(encodeURIComponent).join('/')
    png = execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', `repos/${repo}/contents/${encoded}?ref=${ref}`], { maxBuffer: 256 * 1024 * 1024 })
    // The iOS app keeps its snapshots in Git LFS, so the file in the repo is
    // a pointer to it: the image itself is on GitHub's media host.
    if (png.subarray(0, 40).toString().startsWith('version https://git-lfs')) {
      const sha = gh('api', `repos/${repo}/commits/${ref}`, '--jq', '.sha').trim()
      const response = await fetch(`https://media.githubusercontent.com/media/${repo}/${sha}/${encoded}`)
      if (!response.ok) throw new Error(`Couldn't download ${file} from Git LFS: ${response.status}`)
      png = Buffer.from(await response.arrayBuffer())
    }
  } else {
    usage('Give the source as owner/repo@commit:path, as find prints it, or a file on this computer.')
  }
  const crop = options.crop?.split(',').map(Number)
  if (crop && (crop.length !== 4 || crop.some(Number.isNaN))) usage('Give --crop as x,y,width,height, in the image\'s own pixels.')
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const result = await page.evaluate(async ({ data, crop }) => {
    const image = new Image()
    image.src = `data:image/png;base64,${data}`
    await image.decode()
    const [x, y, width, height] = crop ?? [0, 0, image.naturalWidth, image.naturalHeight]
    const canvas = Object.assign(document.createElement('canvas'), { width, height })
    canvas.getContext('2d').drawImage(image, x, y, width, height, 0, 0, width, height)
    return { webp: canvas.toDataURL('image/webp', 0.9).split(',')[1], size: [image.naturalWidth, image.naturalHeight], out: [width, height] }
  }, { data: png.toString('base64'), crop })
  await browser.close()
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, Buffer.from(result.webp, 'base64'))
  console.log(`Wrote ${out}: ${result.out.join('×')}, from ${result.size.join('×')}.`)
  if (ref) console.log(`In the definition's references, give it "from": "${path.basename(path.dirname(file))}/${path.basename(file, '.png').replace(/@\dx$/, '')}", and the commit, ${ref}, in its sources.`)
} else {
  usage()
}

function usage(message) {
  if (message) console.error(message)
  console.error('Usage: reference.js find <words…> [--ref branch] [--repo ios-app|ios-gov-kit|android-app] [--dark]\n       reference.js fetch <owner/repo@commit:path> <out.webp> [--crop x,y,width,height]')
  process.exit(1)
}
