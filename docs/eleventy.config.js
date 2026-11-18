import { RenderPlugin } from '@11ty/eleventy'
import { govukEleventyPlugin } from '@x-govuk/govuk-eleventy-plugin'
import highlight from 'markdown-it-govuk/highlight'

// Builds the documentation site from docs/. The components themselves have
// no build step: components/ and foundation/ are copied into the site as they
// are, so each page draws the real thing.
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
        { text: 'Examples', href: '/examples/' }
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

  // Renders a component's optional <name>.md on its page.
  eleventyConfig.addPlugin(RenderPlugin)

  // The live components, as they are in the repository. A component's .md is
  // drawn into its page, so isn't published on its own.
  eleventyConfig.addPassthroughCopy({ foundation: 'foundation' })
  eleventyConfig.addPassthroughCopy({ components: 'components' }, { filter: path => !path.endsWith('.md') })
  // Examples of the components put together, as they are in the repository.
  eleventyConfig.addPassthroughCopy({ examples: 'examples' })
  eleventyConfig.addWatchTarget('examples/')
  eleventyConfig.addWatchTarget('components/')
  eleventyConfig.addWatchTarget('foundation/')
  eleventyConfig.addWatchTarget('component.schema.json')

  // The docs' own script, for the examples' "Copy code" buttons.
  eleventyConfig.addPassthroughCopy({ 'docs/assets/docs.js': 'assets/docs.js' })

  // An example's HTML, highlighted as the site's Markdown code blocks are,
  // with a class of our own to style it by.
  eleventyConfig.addFilter('highlightHtml', code =>
    highlight(code, 'html').replace('<pre class="', '<pre class="docs-example__pre '))

  // Every component's page links to every other in its sidebar. Fail the build
  // if one doesn't: Eleventy leaves all but the first page of a paginated
  // template out of collections, and so out of the sidebar, unless told not to.
  eleventyConfig.on('eleventy.after', ({ results }) => {
    const pages = results.filter(result => /^\/components\/[^/]+\/$/.test(result.url))
    for (const page of pages) {
      const missing = pages.filter(other => !page.content.includes(`${other.url}"`))
      if (missing.length) {
        throw new Error(`${page.url} doesn't link to ${missing.map(other => other.url).join(', ')} in its sidebar`)
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
