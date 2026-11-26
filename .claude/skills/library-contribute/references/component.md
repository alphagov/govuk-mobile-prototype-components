# A component

One folder, `src/components/<name>/`, its name in lower case with hyphens, such as `divider` or `link-card`. Its element is `govuk-app-<name>`. A folder with a definition gets its docs page, sidebar entry and catalogue card with nothing else to update, except its group in the catalogue's index.

## Contents

- [Checklist](#checklist)
- [The files](#the-files): template, styles, script, definition, prose
- [A change to a component](#a-change-to-a-component)

## Checklist

Work down it. Each line is a rule from `AGENTS.md`, the schema or `docs/get-started/building-a-component.md`, so `library-review` will check it too.

**Folder**

- [ ] `<name>.html`, `<name>.css`, `<name>.js`, `<name>.json`, and `<name>.md` if there's anything to say that the definition can't, such as known differences.
- [ ] `reference/` with the app's screenshots, as WebP, named `ios-<what>.webp` and `android-<what>.webp`. For a proposed component, a screenshot of the design if you have one as a file, or none.
- [ ] Its slug in one of the groups in `scripts/catalogue.js` (`const groups`), where a designer would look for it. The build fails without it.

**Markup and script**

- [ ] Defined with `defineComponent` from `../../foundation/component.js`, drawn from its `<template>`. Light DOM, vanilla JS, no imports from npm.
- [ ] `attributes` in `defineComponent` are exactly those in the definition's `inputs.attributes` (and each part's). The build checks.
- [ ] Anything pressable is a real `<a href>`, `<button>` or form field. No events of its own: no `CustomEvent`. A button the component acts on itself carries `data-works`.
- [ ] Icons: Material Symbols, never SF Symbols. Load the font with `fonts: [materialSymbols]` in `defineComponent`, and give each icon element the class `govuk-app-icon` as well as its own.

**Styles**

- [ ] Only its own classes: `.govuk-app-<name>` and `.govuk-app-<name>__<part>`, a single class where it can. Never another component's classes, the foundation's (`govuk-app-text`), or a bare element.
- [ ] No `display: contents` on its element, and no `@layer`.
- [ ] Colour, type and spacing from `--app-*` tokens only. A missing token added to `src/foundation/tokens.css`, with a comment naming where it comes from, and `light-dark()` for both modes.
- [ ] Spacing on the 8pt grid: `--app-space-extra-small` (4), `-small` (8), `-medium` (16), `-large` (24), `-extra-large` (32), or a `calc()` of them. Off the grid only where the app has it, with a comment saying where.
- [ ] A comment at the top saying what it's taken from in the app, and its measurements, as `button.css` does.

**Definition** (follows `src/schemas/component.schema.json`)

- [ ] `purpose`: what it's for, in a sentence or two a designer can choose by.
- [ ] `origin.kind`: `govuk` (a GOV.UK app component, the app's own) or `native` (a native component, mirroring a platform control). `origin.notes`: what it's built on, and how it differs from the platform.
- [ ] `proposed.design`, only if it isn't in the app yet, saying where the design comes from. `sources.figma` links it once there's a link.
- [ ] `inputs`: `attributes` with types, values and defaults; `content` in words; `contains` as data (`{}` if nothing goes inside); `parts` for elements that only go inside it.
- [ ] `outputs.events`: only the browser's events, from what it draws. `[]` if none.
- [ ] `rules`: things a designer could get wrong, not a repeat of `purpose`.
- [ ] `avoid`: when it's the wrong choice and what to use instead, written as an element (`govuk-app-button variant="destructive"`) where the library has one. Both ways round: add an entry to look-alikes' `avoid` pointing here if someone might pick them when this is right.
- [ ] `sources.ios` and `sources.android`: each with `repo`, `path`, `symbol` and `ref`, the commit read. `[]` for a platform that hasn't it.
- [ ] `references`: every file in `reference/`, each with `platform`, `description` and `from` (the snapshot test).
- [ ] `examples`: each state, as the HTML that draws it, built from the library's components only. If the app's layout around it can't be built from them, such as a label on the left and its value on the right, simplify the example rather than add styles of its own: the example shows this component, not its surroundings. `"frame": "screen"` for something that lays out a whole screen, `"page"` for something drawn on a screen's background; leave it out for something on a modal's.

**Prose** (`<name>.md`, optional)

- [ ] Headings start at `##`.
- [ ] "Known differences from the app" (or "from the designs", if proposed), listing every way it differs that you know of, such as dark mode colours you chose because the design has none.

## The files

Skeletons to start from, for a component called `example`. Replace every `<…>`. Copy the shape of an existing component like yours where it's closer.

### `example.html`

```html
<!-- <What it draws, in a sentence: its parts, in order, and where its text
     comes from.> -->
<template>
  <div class="govuk-app-example" data-attr="data-variant: variant">
    <span class="govuk-app-example__label" data-text="label"></span>
    <span class="govuk-app-example__content" data-slot="content"></span>
  </div>
</template>
```

What fills a template in: `data-text="x"` (text), `data-attr="a: x"` (attributes; `true` sets it empty, `false` or missing leaves it off), `data-if="x"` (left out unless `x`), `data-slot="content"` (what was between the tags), `data-tag="x: h1 h2"` (the element's tag). To vary its look, set a `data-` attribute and select on it in the CSS.

### `example.css`

```css
/* <Where it comes from in the app: GovKit's X, or the Android app's Y, and
   its measurements: sizes, spacing, corners, which colour token for what.
   Say here why any value is off the 8pt grid.> */

.govuk-app-example {
  display: flex;
  gap: var(--app-space-small);
  padding: var(--app-space-medium);
  color: var(--app-text-primary);
  font-size: var(--app-font-body-size);
  font-weight: var(--app-font-body-weight);
}

.govuk-app-example[data-variant="<variant>"] {
  background: var(--app-<token>);
}
```

Read `src/foundation/tokens.css` for what's there before adding one. A new token goes in the group it belongs to, as:

```css
  --app-<thing>-<part>: light-dark(#xxxxxx, #yyyyyy); /* <GovKit token name, or where in the app it comes from> */
```

### `example.js`

```js
import { defineComponent } from '../../foundation/component.js'

const variants = ['<default>', '<other>']

/**
 * <Why: what the template can't say for itself, such as a default.>
 */
export function prepare(data) {
  return {
    ...data,
    variant: variants.includes(data.variant) ? data.variant : '<default>',
  }
}

await defineComponent({
  name: 'example',
  template: new URL('./example.html', import.meta.url),
  styles: new URL('./example.css', import.meta.url),
  attributes: ['variant', 'label'],
  prepare,
})
```

Leave out `prepare` if there's nothing to work out. Add `fonts: [materialSymbols]` (imported from `component.js` too) if it draws icons.

### `example.json`

```json
{
  "$schema": "../../schemas/component.schema.json",
  "name": "<What a designer calls it>",
  "element": "govuk-app-example",
  "purpose": "<What it is for, in a sentence or two.>",
  "origin": {
    "kind": "govuk",
    "notes": "<What it is in the app, and what it's built on. Drawn here as it looks on iOS.>"
  },
  "inputs": {
    "attributes": {
      "variant": {
        "type": "enum",
        "values": ["<default>", "<other>"],
        "default": "<default>",
        "description": "<What each does.>"
      },
      "label": {
        "type": "string",
        "required": true,
        "description": "<What it is, with an example.>"
      }
    },
    "content": "<What goes between its tags, in words, or null.>",
    "contains": { "text": true }
  },
  "outputs": { "events": [] },
  "rules": [
    "<Something a designer could get wrong.>"
  ],
  "avoid": [
    { "when": "<A situation it's the wrong choice for>", "instead": "govuk-app-<other>" }
  ],
  "sources": {
    "figma": [],
    "ios": [
      { "repo": "govuk-once/govuk-mobile-ios-app", "path": "<path>", "symbol": "<Type>", "ref": "<8-character commit>" }
    ],
    "android": [
      { "repo": "govuk-once/govuk-mobile-android-app", "path": "<path>", "symbol": "<Composable>", "ref": "<8-character commit>" }
    ]
  },
  "references": [
    { "platform": "ios", "image": "reference/ios-<what>.webp", "description": "<What it shows>", "from": "<SnapshotTests/test_name>" }
  ],
  "examples": [
    { "name": "<The usual case>", "html": "<govuk-app-example label=\"…\"></govuk-app-example>" }
  ]
}
```

For a proposed component, add after `purpose`:

```json
  "proposed": { "design": "<the Figma file, or a screenshot of it until there's a link>" },
```

### `example.md`

```markdown
## Known differences from the app

- <Each difference, and why: "The app draws it 0.33pt thick; most screens show that as 1 pixel, as here.">
```

For a proposed one, call it "Known differences from the designs", and add a "Where it comes from" section first, as `status.md` does.

## A change to a component

- Read the whole folder first, and the definitions that point to it in their `avoid` (`grep -l govuk-app-<name> src/components/*/*.json`).
- Keep its attributes working: a prototype may use them. Add, rather than rename; if something must go, say so in the PR.
- Change the definition with the code: a new attribute in `inputs` and in `defineComponent`'s `attributes`, a new state in `examples`, a new difference in the `.md`.
- If you read the app again, update `ref` to the commit you read.
- Screenshot it before and after (`npm run screenshots -- <name> --no-build` on `main` first, and keep a copy) so you can say in the PR what changed.
