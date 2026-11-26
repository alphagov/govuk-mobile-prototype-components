import { defineComponent, headingLevel, materialSymbols } from '../../foundation/component.js'

const types = ['information', 'local-emergency', 'national-emergency', 'notable-death', 'warning']

/** Information unless it names another type; its title an h2 unless level says. */
function prepare(data) {
  const level = headingLevel(data.level, [2, 3, 4])
  return {
    ...data,
    type: types.includes(data.type) ? data.type : 'information',
    tag: `h${level}`,
    linkText: data.link,
  }
}

/**
 * Pressing a banner's close button hides it, as the app's does. The page can
 * listen for the click too, by the button's name, dismiss, and its value,
 * the banner's name.
 */
document.addEventListener('click', event => {
  const banner = event.target.closest?.('.govuk-app-banner__dismiss')?.closest('govuk-app-banner')
  if (banner) banner.hidden = true
})

await defineComponent({
  name: 'banner',
  template: new URL('./banner.html', import.meta.url),
  styles: new URL('./banner.css', import.meta.url),
  fonts: [materialSymbols],
  attributes: ['type', 'title', 'level', 'dismissible', 'link', 'href', 'name', 'icon'],
  prepare,
})
