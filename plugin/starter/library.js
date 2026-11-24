// Where the GOV.UK app prototype components are, once installed: the one
// place that says so. The server serves the whole package at /library/, so a
// path the catalogue gives, from the package's root, is /library/ + that path:
// /library/components/button/button.js.

import path from 'node:path'

/** The installed package, served at /library/. */
export const library = path.join(import.meta.dirname, 'node_modules', 'govuk-mobile-prototype-components')

/**
 * The folder in the package that holds its components, foundation, frame,
 * patterns and templates. The package's root for now. When the library moves
 * them into src/, change this to 'src'.
 */
export const source = 'src'

/** That folder on disk. */
export const libraryFiles = path.join(library, source)

/** Its URL, where a page loads components from: /library/ or /library/src/. */
export const libraryUrl = `/library/${source ? `${source}/` : ''}`

/** Its catalogue, built when it's installed, always at the package's root. */
export const catalogue = path.join(library, 'catalogue')

// `node library.js` says where they are, for a tool that needs to read them.
if (process.argv[1] === import.meta.filename) {
  console.log(JSON.stringify({ library, libraryFiles, libraryUrl, catalogue }, null, 2))
}
