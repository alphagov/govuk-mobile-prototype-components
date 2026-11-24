// Where the GOV.UK app prototype components are, once installed: the one
// place that says so. The server serves them at /library/ from here, and
// anything that reads them from disk asks here too.

import path from 'node:path'

/** The installed package. */
export const library = path.join(import.meta.dirname, 'node_modules', 'govuk-mobile-prototype-components')

/**
 * Its components, foundation, frame, patterns and templates, which the
 * server serves at /library/. The package root for now; if the library
 * moves them, into src/ say, change this line to match.
 */
export const libraryFiles = library

/** Its catalogue, built when it's installed, served at /library/catalogue/. */
export const catalogue = path.join(library, 'catalogue')

// `node library.js` says where they are, for a tool that needs to read them.
if (process.argv[1] === import.meta.filename) {
  console.log(JSON.stringify({ library, libraryFiles, catalogue }, null, 2))
}
