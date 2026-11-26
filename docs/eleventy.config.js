import { RenderPlugin } from '@11ty/eleventy'
import { govukEleventyPlugin } from '@x-govuk/govuk-eleventy-plugin'
import highlight from 'markdown-it-govuk/highlight'

import { forgetDefinitions } from '../scripts/definitions.js'

// Builds the documentation site from docs/. The components themselves have
// no build step: the library, in src/, is copied into the site as it
// is, so each page draws the real thing.
export default async function (eleventyConfig) {
  await eleventyConfig.addPlugin(govukEleventyPlugin, {
    // The plugin's styles, in a cascade layer: see assets/application.scss.
    stylesheets: ['/assets/application.css'],
    header: {
      productName: 'App prototype components',
      phaseBanner: {
        tag: { text: 'Alpha' },
        text: 'These components are for prototyping the GOV.UK app, not for use in production.'
      }
    },
    serviceNavigation: {
      navigation: [
        { text: 'Get started', href: '/get-started/' },
        { text: 'Components', href: '/components/' },
        { text: 'Patterns', href: '/patterns/' },
        { text: 'Examples', href: '/examples/' },
        { text: 'Templates', href: '/templates/' }
      ]
    },
    markdown: {
      headingPermalinks: true
    },
    titleSuffix: 'GOV.UK app prototype components',
    footer: {
      meta: {
        items: [
          { href: 'https://github.com/alphagov/govuk-mobile-prototype-components', text: 'GitHub repository' }
        ]
      }
    }
  })

  // The definitions are read once for each build, by every page's data, so
  // `npm start` reads them afresh after a change.
  eleventyConfig.on('eleventy.before', forgetDefinitions)

  // Renders a component's optional <name>.md on its page.
  eleventyConfig.addPlugin(RenderPlugin)

  // The library, at the same paths as in the repository, so the examples'
  // and templates' relative links work the same in both. A component's .md
  // is drawn into its page, and a template's .json into its, so neither is
  // published on its own. A pattern's HTML is drawn into its page too.
  eleventyConfig.addPassthroughCopy({ 'src/foundation': 'src/foundation' })
  eleventyConfig.addPassthroughCopy({ 'src/components': 'src/components' }, { filter: path => !path.endsWith('.md') })
  eleventyConfig.addPassthroughCopy({ 'src/frame': 'src/frame' })
  eleventyConfig.addPassthroughCopy({ 'src/templates': 'src/templates' }, { filter: path => !path.endsWith('.json') })
  eleventyConfig.addWatchTarget('src/')
  // Examples of the components put together, as they are in the repository.
  eleventyConfig.addPassthroughCopy({ examples: 'examples' })
  eleventyConfig.addWatchTarget('examples/')

  // Everything in the library, for tools that build prototypes: an index, a
  // card for each thing, and all of it as data. `npm run build` writes it
  // before it gets here.
  eleventyConfig.addPassthroughCopy('catalogue')

  // The docs' own script, for the examples' "Copy code" buttons.
  eleventyConfig.addPassthroughCopy({ 'docs/assets/docs.js': 'assets/docs.js' })

  // An example's HTML, highlighted as the site's Markdown code blocks are,
  // with a class of our own to style it by.
  eleventyConfig.addFilter('highlightHtml', code =>
    highlight(code, 'html').replace('<pre class="', '<pre class="docs-example__pre '))

  // Every component's page links to every other in its sidebar, and every
  // pattern's to every other pattern's, and every template's to every other
  // template's. Fail the build if one doesn't: Eleventy leaves all but the
  // first page of a paginated template out of collections, and so out of the
  // sidebar, unless told not to. A template's page is at about/, since its
  // own index.html is at /templates/<name>/.
  eleventyConfig.on('eleventy.after', ({ results }) => {
    for (const section of ['components/[^/]+', 'patterns/[^/]+', 'templates/[^/]+/about']) {
      const pages = results.filter(result => new RegExp(`^/${section}/$`).test(result.url))
      for (const page of pages) {
        const missing = pages.filter(other => !page.content.includes(`${other.url}"`))
        if (missing.length) {
          throw new Error(`${page.url} doesn't link to ${missing.map(other => other.url).join(', ')} in its sidebar`)
        }
      }
    }
  })

  return {
    dir: {
      input: 'docs',
      output: '_site',
      includes: '_includes',
      data: '_data'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  }
}
