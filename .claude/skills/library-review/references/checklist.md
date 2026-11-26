# The library's rules, to review against

Every rule here is one the repository already has. Each says where it comes from, so a finding can cite it, and so this list can be checked against the source when the rules change: if they disagree, the source wins, and this file should be brought up to date.

- **AGENTS.md** is the rules we've agreed. Most of what's here.
- **Schema**: `src/schemas/component.schema.json` (or `src/schemas/pattern.schema.json`), its descriptions as well as its shape.
- **Build a component**: `docs/get-started/building-a-component.md`.
- **PLAN.md**: what the library is for.

"Build" after a rule means `npm run build` fails if it's broken, so a reviewer needs only to run it. "Script" means `scripts/check.js` points at likely breaks, for a reviewer to read. Everything else is read by eye.

## Contents

- [Definition](#definition)
- [Markup and JS](#markup-and-js)
- [Styles](#styles)
- [Docs site](#docs-site)
- [Icons](#icons)
- [Writing](#writing)
- [Patterns](#patterns)
- [Looks like the app](#looks-like-the-app)

## Definition

`src/components/<name>/<name>.json`, and the folder around it.

| Rule | From | Checked by |
| --- | --- | --- |
| One folder, `src/components/<name>/`, with `<name>.html`, `.css`, `.js`, `.json`, an optional `.md`, and `reference/`. Nothing else to update: the folder gets its page, index entry and sidebar entry. | AGENTS.md, Components | Build (sidebar) |
| It matches `src/schemas/component.schema.json`. | AGENTS.md, Components; Schema | Build |
| `purpose` says what it's for, in a sentence or two, plainly enough for a designer to choose it. | Schema `purpose`; PLAN.md | Eye |
| `origin.kind` is `govuk` for a GOV.UK app component, the app's own, and `native` for a native component, mirroring a platform control. `origin.notes` says what it's built on, and how it differs from the platform. Use those names, "GOV.UK app component" and "native component", in prose too. | AGENTS.md, Components; Schema `origin` | Eye |
| A component that isn't in the app yet is **proposed**: `proposed.design` says where its design comes from, and `sources.figma` links it once there's a link. One that's in the app has no `proposed`. If it ships, `proposed` goes and its sources point at the app. | AGENTS.md, Components; Schema `proposed` | Eye; script notes a proposed one with no Figma link |
| `avoid` lists when it's the wrong choice and what to use instead. Think of the components someone might pick it over by mistake, look-alikes especially (a button or a row, a heading or a section heading, a sheet or a full-screen cover), and check each has an entry, both ways round. | AGENTS.md, Components; Build a component, "When not to use it" | Eye. Build checks there's at least one |
| `avoid.instead` is written as an element, with any attributes, as in HTML (`govuk-app-button variant="destructive"`), where the library has one, and in words only where it hasn't. | AGENTS.md, Components; Schema `avoid` | Build checks elements written alone; script notes ones buried in words, which the build can't check |
| `rules` say how and when to use it. Useful ones: something a designer could get wrong, not a restatement of `purpose`. | Schema `rules`; PLAN.md | Eye |
| `inputs` say exactly what its script reads: its attributes, and its parts' attributes. `contains` names only the library's elements. | Build a component, "What goes inside it, as data" | Build |
| `outputs.events` lists only the browser's events, from the links, buttons and fields it draws. | Schema `outputs`; AGENTS.md, Components | Eye |
| `sources` say where it comes from: the iOS and Android source, each with the `ref`, the commit read. | AGENTS.md, Components | Script (a source with no `ref`) |
| `references` are the app's own screenshots, in `reference/`, each with its platform and what it shows. Every listed file exists, and every file is listed. A proposed component may have none, if its design is noted in `proposed`. | AGENTS.md, Components; Schema `references` | Script |
| `examples` show each of its states, as the HTML that draws them, in the right `frame`. | Schema `examples` | Eye |
| Where it can't match the app, or its design if proposed, `<name>.md` says so under "Known differences from the app" (status.md's "from the designs" is the same). | AGENTS.md, Components; Build a component, "Proposed components" | Eye; script notes a changed component without one |
| `<name>.md` starts its headings at `##`. | Build a component, "Prose for a component's page" | Eye |

## Markup and JS

`<name>.html` and `<name>.js`.

| Rule | From | Checked by |
| --- | --- | --- |
| A web component in the light DOM, vanilla JS, no build step, no framework. No `attachShadow`, no imports from npm. | AGENTS.md, Components; PLAN.md | Script (shadow DOM); eye |
| Defined with `defineComponent` from `src/foundation/component.js`, which draws it from its `<template>`, filled with `data-text`, `data-attr`, `data-if`, `data-slot` and `data-tag`. The script works out only what the template can't, such as defaults, in `prepare`. | AGENTS.md, Components; Build a component, "Templates" | Script notes `customElements.define` and HTML written from script |
| No events of its own: no `CustomEvent`. It draws real links (`<a href>`), buttons (`<button>`) and fields (`<input>`, `<select>`, `<textarea>`), whose events bubble. Re-sending a real field's own event, as search-field does with `input` when it clears, is fine. | AGENTS.md, Components; Schema `outputs` | Script; eye for a `<div>` or `<span>` made to act like a button or link |
| A button the component acts on itself carries `data-works`. | Build a component, "Templates" | Eye |

## Styles

`<name>.css`, and `src/foundation/tokens.css` if it adds tokens.

| Rule | From | Checked by |
| --- | --- | --- |
| A component styles only its own classes, `govuk-app-NAME` and `govuk-app-NAME__part`, and its own elements. Never another component's classes, the foundation's (such as `govuk-app-text`), or a bare element (`p`, `a`, `button` with no class of its own). | AGENTS.md, Styles; Build a component, "Styles stay apart" | Script |
| A single class where it can: `.govuk-app-NAME__part`, not `.govuk-app-NAME .govuk-app-NAME__part`, unless the parent's state matters. | AGENTS.md, Styles | Eye |
| No `display: contents` on the component's element: `component.js` sets it for every one. (On a part of its own, such as grouped-list's `__list`, it's fine.) | AGENTS.md, Styles | Script |
| Only `--app-*` tokens from `src/foundation/tokens.css` for colour, type and spacing. No hex, `rgb()`, `hsl()` or named colours. A missing token is added to `tokens.css`, with a comment naming where it comes from (a GovKit token, the Android app, the platform). | AGENTS.md, Styles | Script (raw colours, unknown tokens, raw type sizes) |
| Spacing is on the 8pt grid, as tokens: `--app-space-extra-small` (4), `-small` (8), `-medium` (16), `-large` (24), `-extra-large` (32), or a `calc()` of them. A value off the grid only where the app itself has it, with a comment saying so, as `button.css` does with GovKit's 13pt. Sizes of things (an icon's width) aren't spacing. | AGENTS.md, Styles; Build a component, step 3 | Script |
| No cascade layer (`@layer`) in a component's styles. A page's styles go in one instead. | AGENTS.md, Styles; Build a component, "Styles stay apart" | Script |
| Light and dark: tokens use `light-dark()`, so a component that uses only tokens gets both. A new token gives both values. | AGENTS.md, Styles | Eye on `tokens.css`; screenshots |

## Docs site

`docs/`.

| Rule | From | Checked by |
| --- | --- | --- |
| Style things through our own `docs-` classes. Never select on GOV.UK Frontend's or the Eleventy plugin's classes (`govuk-*`, `x-govuk-*`, `app-*`): add a `docs-` class and style that. | AGENTS.md, Styles | Script (`docs/assets/*.scss`); eye on any `<style>` in a page |
| `npm run build` passes. | AGENTS.md, Docs site | Build |

## Icons

| Rule | From | Checked by |
| --- | --- | --- |
| Material Symbols in place of SF Symbols, which may only be used on Apple's platforms. No SF Symbols images or font, and no SF glyphs copied into SVG. | AGENTS.md, Components | Script (font-family); eye on images |
| The font is loaded with `fonts: [materialSymbols]` (or `materialSymbolsOutlined` for topic icons) in `defineComponent`, never `@import` in the CSS. Its files are in `src/foundation/fonts/`: nothing loads from another site. | AGENTS.md, Components | Script |
| Each element drawn in the font has the class `govuk-app-icon` as well as its own. | AGENTS.md, Components | Script |

## Writing

Comments, `.md` prose, the definition's words, and commit messages.

| Rule | From | Checked by |
| --- | --- | --- |
| Plain, short UK English (colour, centre, organise), in the voice of the existing docs and comments: short sentences, no jargon a designer wouldn't know, no marketing. | AGENTS.md, Writing | Eye |
| Comments say why, not what: where a value comes from in the app, or why it's done this way. Not a restatement of the line below. | AGENTS.md, Writing | Eye |
| Commits: a short imperative subject ("Add a status component", not "Added" or "Adds"), then a body saying why. | AGENTS.md, Writing | Eye: `git log --format='%h %s%n%b' origin/main..HEAD` |

## Patterns

`src/patterns/<name>/`, if the change has one.

| Rule | From | Checked by |
| --- | --- | --- |
| `<name>.html` is one `<govuk-app-screen>` with generic but real content; `<name>.json` follows `src/schemas/pattern.schema.json`. | AGENTS.md, Patterns | Build |
| Taken from a real screen of the app, named in `screen` and `sources`. | AGENTS.md, Patterns | Eye |
| `when` and `avoid` let someone choose between patterns from them alone. `avoid.instead` names another pattern exactly. | AGENTS.md, Patterns | Eye |
| `components` lists exactly the components the HTML uses. | AGENTS.md, Patterns | Build |

## Looks like the app

| Rule | From | Checked by |
| --- | --- | --- |
| It matches the app, or for a proposed component, its design: size, spacing, colour, type, corners, in every state, light and dark. | AGENTS.md, Components; PLAN.md | Screenshots beside `reference/` |
| Each example is checked in light and dark against the references before the component is done. | AGENTS.md, Docs site | Screenshots |
