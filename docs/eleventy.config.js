import { RenderPlugin } from '@11ty/eleventy'
import { govukEleventyPlugin } from '@x-govuk/govuk-eleventy-plugin'

// Builds the documentation site from docs/. The components themselves have
// no build step: components/ and foundation/ are copied into the site as they
// are, so each page draws the real thing.
export default async function (eleventyConfig) {
  await eleventyConfig.addPlugin(govukEleventyPlugin, {
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
        { text: 'Components', href: '/components/' }
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
  eleventyConfig.addWatchTarget('components/')
  eleventyConfig.addWatchTarget('foundation/')
  eleventyConfig.addWatchTarget('component.schema.json')

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
