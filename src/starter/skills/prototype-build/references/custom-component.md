# A custom component

Only for something the library's components can't draw, however they're arranged. Make it the library's way, so it looks like the app beside them, works in light and dark, and could later be taken into the library by a developer.

Look at a library component like it first, such as `<library>/components/status/` or `<library>/components/link-card/`: its four files are short, and copying their shape is most of getting it right.

## Where

`components/<name>/` in the prototype, its name in lower case with hyphens, such as `bin-day`. Its element is `govuk-app-<name>`. Four files:

| File | What it is |
| --- | --- |
| `<name>.html` | What it draws, as a `<template>` |
| `<name>.css` | Its styles |
| `<name>.js` | Defines the element, from the template |
| `<name>.json` | What it's for and what it takes, like the library's definitions |

A screen loads it like any other: `<script type="module" src="/components/<name>/<name>.js"></script>`.

## `<name>.html`

```html
<!-- <What it draws, in a sentence: its parts, in order, and where its text
     comes from.> -->
<template>
  <div class="govuk-app-<name>" data-attr="data-variant: variant">
    <span class="govuk-app-<name>__icon govuk-app-icon" aria-hidden="true" data-text="icon" data-if="icon"></span>
    <span class="govuk-app-<name>__title" data-text="title"></span>
    <span class="govuk-app-<name>__content" data-slot="content"></span>
  </div>
</template>
```

`data-text="x"` fills in text from the attribute `x`; `data-attr="a: x"` sets attribute `a` from `x`; `data-if="x"` leaves the element out unless `x` is given; `data-slot="content"` holds what was written between the component's tags. To vary its look, set a `data-` attribute and select on it in the CSS. Anything that can be pressed is a real `<a href>` or `<button>`, so it works with the screen's script and the keyboard.

## `<name>.js`

```js
import { defineComponent, materialSymbols } from '/library/src/foundation/component.js'

await defineComponent({
  name: '<name>',
  template: new URL('./<name>.html', import.meta.url),
  styles: new URL('./<name>.css', import.meta.url),
  attributes: ['variant', 'title', 'icon'],
  // Only if it draws icons.
  fonts: [materialSymbols],
})
```

## `<name>.css`

```css
/* <What it's taken from: the designer's Figma frame, their screenshot, or
   "made for this prototype, in the library's style". Its measurements.> */

.govuk-app-<name> {
  display: flex;
  gap: var(--app-space-small);
  padding: var(--app-space-medium);
  /* A grouped list's corners, the app's 10pt, off the grid. */
  border-radius: 10px;
  background: var(--app-surface-list);
  color: var(--app-text-primary);
  font-size: var(--app-font-body-size);
  font-weight: var(--app-font-body-weight);
}

.govuk-app-<name>__title {
  font-weight: var(--app-font-body-emphasis-weight);
}

.govuk-app-<name>__icon {
  /* The icons' font, as the library's own icons have it. The class
     govuk-app-icon only hides the icon until the font has loaded. */
  font-family: "Material Symbols Rounded";
  font-size: var(--app-font-title-3-emphasis-size);
  font-weight: normal;
  line-height: 1;
  white-space: nowrap;
  font-feature-settings: "liga";
  color: var(--app-text-link);
}
```

The rules, the library's own:

- **Its own classes only**: `.govuk-app-<name>` and `.govuk-app-<name>__<part>`. Never another component's classes, or a bare element such as `p`.
- **Tokens only**, for colour, type and spacing: the `--app-*` custom properties in `<library>/foundation/tokens.css`. Read its comments to find the right one: surfaces (`--app-surface-page`, `-modal`, `-list`, `-card`), text (`--app-text-primary`, `-secondary`, `-link`, `-error`), borders (`--app-border-row`, `--app-border-list-divider`), icons, statuses and type (`--app-font-<style>-size`, `-weight`, `-leading`). They change by themselves for dark mode, so a component that uses only tokens works in both. Never a colour of your own, such as `#1d70b8` or `white`: it won't change in dark.
- **The 8pt grid**: `--app-space-extra-small` (4), `-small` (8), `-medium` (16), `-large` (24), `-extra-large` (32), or a `calc()` of them. A value off the grid only to match a design exactly, with a comment saying so.
- **Icons** are Material Symbols: an element with the icon's name as its text, such as `delete`, the class `govuk-app-icon` as well as its own, and its own class styled with `font-family: "Material Symbols Rounded"`, as in the skeleton. Load the font with `fonts: [materialSymbols]`, never an `@import`. Without the font-family, the icon shows as its name.
- No `display: contents` on its element (the library does that), and no `@layer`.
- Nothing from other sites: put any picture it needs in its folder.

## `<name>.json`

The same shape as a library definition, such as `<library>/components/status/status.json`, kept short:

```json
{
  "name": "<What a designer calls it>",
  "element": "govuk-app-<name>",
  "purpose": "<What it's for, in a sentence.>",
  "proposed": { "design": "<Where its design comes from: a Figma link, the designer's screenshot, or made for this prototype>" },
  "inputs": {
    "attributes": {
      "title": { "type": "string", "required": true, "description": "<What it is, with an example>" }
    },
    "content": "<What goes between its tags, or null>"
  },
  "rules": ["<Something someone could get wrong using it>"],
  "examples": [
    { "name": "<The usual case>", "html": "<govuk-app-<name> title=\"…\"></govuk-app-<name>>" }
  ]
}
```

It's how the next person, or Claude next time, knows what it's for and how to use it, and what a developer needs to take it into the library.

## Matching the library's style

With no design, make it look like it belongs: a white card (`--app-surface-list`) on the page's pale blue, corners and spacing like a grouped list's, Body text, Subheadline in grey (`--app-text-secondary`) for anything secondary, the link colour for anything pressable. Put it beside the library's components on a screen and screenshot both modes: it should be hard to tell which one is custom.
