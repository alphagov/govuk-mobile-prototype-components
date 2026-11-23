import { defineComponent } from '../../foundation/component.js'

const backgrounds = ['page', 'modal', 'green', 'chat']

/**
 * Sorts what was written between the tags into the screen's parts, so a
 * prototype writes a screen top to bottom and needn't wrap each part: a
 * navigation bar, or the home screen's header, goes at the top, a tab bar at
 * the bottom of what scrolls, anything marked slot="footer", such as a button
 * stack, is pinned below that, and the rest is the content.
 */
export function prepare(data) {
  const parts = { bar: [], body: [], tabs: [], footer: [] }
  for (const node of data.content) {
    const tag = node.nodeType === Node.ELEMENT_NODE ? node.localName : null
    if (tag === 'govuk-app-nav-bar' || tag === 'govuk-app-home-header') parts.bar.push(node)
    else if (tag === 'govuk-app-tab-bar') parts.tabs.push(node)
    else if (tag && node.getAttribute('slot') === 'footer') parts.footer.push(node)
    else parts.body.push(node)
  }
  // With a footer too, such as GOV.UK Chat's field, the tab bar goes below
  // it, out of what scrolls, as iOS sets the chat's field above the tab bar.
  if (parts.footer.length && parts.tabs.length) {
    parts.footer.push(...parts.tabs)
    parts.tabs = []
  }
  return {
    ...data,
    ...parts,
    background: backgrounds.includes(data.background) ? data.background : 'page',
    // With no navigation bar, the content starts below the status bar itself.
    underStatusBar: parts.bar.length === 0,
    underHomeHeader: parts.bar.some(node => node.localName === 'govuk-app-home-header'),
  }
}

await defineComponent({
  name: 'screen',
  template: new URL('./screen.html', import.meta.url),
  styles: new URL('./screen.css', import.meta.url),
  attributes: ['background'],
  prepare,
})
