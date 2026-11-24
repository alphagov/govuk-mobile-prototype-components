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

  // Renders a component's optional <name>.md on its page.
  eleventyConfig.addPlugin(RenderPlugin)

  // The live components, as they are in the repository. A component's .md is
  // drawn into its page, so isn't published on its own.
  eleventyConfig.addPassthroughCopy({ foundation: 'foundation' })
  eleventyConfig.addPassthroughCopy({ components: 'components' }, { filter: path => !path.endsWith('.md') })
  // The phone the examples are shown in, as it is in the repository.
  eleventyConfig.addPassthroughCopy({ frame: 'frame' })
  // Examples of the components put together, as they are in the repository.
  eleventyConfig.addPassthroughCopy({ examples: 'examples' })
  eleventyConfig.addWatchTarget('examples/')
  eleventyConfig.addWatchTarget('components/')
  eleventyConfig.addWatchTarget('foundation/')
  eleventyConfig.addWatchTarget('frame/')
  eleventyConfig.addWatchTarget('component.schema.json')
  // A pattern's HTML is drawn into its page, so it isn't copied.
  eleventyConfig.addWatchTarget('patterns/')
  eleventyConfig.addWatchTarget('pattern.schema.json')
  // Templates, as they are in the repository, so each page can be opened
  // live. Their definitions are drawn into their docs pages.
  eleventyConfig.addPassthroughCopy({ templates: 'templates' }, { filter: path => !path.endsWith('.json') })
  eleventyConfig.addWatchTarget('templates/')
  eleventyConfig.addWatchTarget('template.schema.json')

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
