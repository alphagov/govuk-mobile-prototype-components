---
layout: sub-navigation
title: Build a component
description: How a component is put together, and how to add one to the library.
sectionKey: Get started
order: 3
---

## A component

Each component is one folder, `src/components/<name>/`:

| File | What it holds |
| --- | --- |
| `<name>.html` | Its template: the markup it draws, in a `<template>` |
| `<name>.css` | Its styles |
| `<name>.js` | Defines its element, `<govuk-app-NAME>`, and works out anything the template can’t say for itself, such as defaults |
| `<name>.json` | Its definition: what it is for, whether it’s a native component or a GOV.UK app component, whether it’s proposed, its inputs and outputs, rules for its use, when not to use it, its sources (Figma, iOS, Android), and examples. It follows `src/schemas/component.schema.json` |
| `<name>.md` | Optional. Prose for its page that the definition can’t say well, such as longer guidance or known differences from the app |
| `reference/` | Screenshots of the app’s own component, to compare it with |

Every folder with a definition gets a page on this site, drawn from the definition. The build checks each definition against `src/schemas/component.schema.json`, and fails if one doesn’t match.

### What goes inside it, as data

A definition’s `inputs` say what a page can give the component, in a form tools can use as well as people, such as a schema for prototypes written as data:

- `attributes`: each attribute it reads, with its type, any allowed values and its default.
- `content`: what goes between its tags, in words, for its page.
- `contains`: the same, as data. `text` if text goes between its tags, with any `inline` elements that can go around a few words of it, such as `govuk-app-strong`. `elements`, the elements that go between its tags, or `"any"` of the library’s components. `slots`, what goes in each slot a page fills with `slot="…"`. Empty if nothing goes inside it.
- `parts`: the elements that only go inside it, such as a grouped list’s `govuk-app-grouped-list-row`, each with its own `description`, `attributes` and `contains`.

The build fails if these disagree with the component’s script: the elements it defines, and the attributes each reads, must be exactly those its definition lists. Every element named in `contains` must be one of the library’s components or a part of one.

### When not to use it

A definition’s `avoid` lists the times the component is the wrong choice, each with what to use instead, so a designer, or a tool building a prototype, can choose between components that look alike or do similar things: a button or a grouped list’s row, a heading or a section heading, a sheet or a full-screen cover.

- `when`: the situation, such as For an action on the whole screen, such as Edit.
- `instead`: what to use. Where the library has something, write it as its element, with any attributes it needs, as in HTML: `govuk-app-nav-bar-item`, or `govuk-app-button variant="destructive"`. Its page links to it, and the build fails if the element, an attribute or a value isn’t one the library has. Where nothing in the library fits, say what to do, in words.

### Proposed components

A component that isn’t in the app yet, such as one from future designs, has `proposed` in its definition, saying where its design comes from. Match the design as you would the app, and say where it differs under “Known differences from the app”. Its page is tagged and warned, and it’s listed apart from the app’s components. If it ships, remove `proposed` and point its sources at the app.

### Prose for a component’s page

If a component has a `<name>.md`, it appears on its page after the introduction and before the examples. Start its headings at `##`. It can include live examples, since the component’s script is already on the page:

```markdown
## Buttons in a group

<govuk-app>
  <govuk-app-button>Continue</govuk-app-button>
  <govuk-app-button variant="grouped-secondary">Skip</govuk-app-button>
</govuk-app>
```

## Templates

There is no build step for components. `src/foundation/component.js` fetches the template when the page runs and fills it in from the element’s attributes and content, using a few attributes in the template:

| Attribute | |
| --- | --- |
| `data-text="x"` | The element’s text is `x` |
| `data-attr="a: x, b: y"` | Attribute `a` is `x`. `true` sets it empty; `false` or absent leaves it off. `style` is set through the CSSOM, declaration by declaration, so it applies under a Content Security Policy that blocks inline styles |
| `data-if="x"` | The element is left out unless `x` is present |
| `data-slot="content"` | The element holds what was written between the component’s tags |
| `data-tag="x: h1 h2"` | The element’s tag is `x`, if it is one of those listed, and as written otherwise |

These are the same as in the app prototyping system’s kit (`exploration-2/kit`), which this structure is based on.

A button the component acts on itself, such as a segmented control’s segment, carries `data-works`, so a root with [`highlight-actions`](/get-started/#show-what-works) rings it among what works. Any other button is rung only if the page says it works.

`src/foundation/` holds what every component relies on: `tokens.css` (the app’s colours, type, spacing and sizes, each naming where it comes from), `base.css` (the `<govuk-app>` root) and `component.js`.

## Building one

1. Find the component in `inventory/COMPONENTS.md`, and read its iOS and Android source.
2. Copy its reference screenshots into `reference/`.
3. Write the four files. Use only `--app-*` tokens for colour, type and spacing; add any missing ones to `src/foundation/tokens.css`, naming where they come from. Spacing is on the 8pt grid (`--app-space-extra-small` to `--app-space-extra-large`: 4, 8, 16, 24 and 32). Keep a value off the grid only where the app itself has it, and say so in a comment.
4. Run `npm start` and open its page. Check every example against the references, in each state.

To check without a browser, `npm run screenshots -- <name>` draws each of its examples in light and dark into `screenshots-out/<name>/`, and `screenshots-out/index.html` shows them beside its references. Install the browser it uses first, once, with `npx playwright install chromium`. See the [README](https://github.com/alphagov/govuk-mobile-prototype-components#checking-what-a-component-looks-like) for its other options.

## Check your work

Before you open a pull request, ask Claude Code to review your changes. The repository has a skill for it, `library-review`, in `.claude/skills/`: say “review my changes”, or “review PR 80” for someone else’s.

It runs `npm run build`, checks the changed lines for the rules a script can spot (raw colours, spacing off the grid, another component’s classes), draws your examples in light and dark and compares them with the references, and reads the change against the rest of the rules in `AGENTS.md`. It reports what must be fixed, what should be, and what’s worth a second look, each with the file, the line, the rule and how to fix it, and offers to fix them.

You can run the script on its own, too:

```sh
node .claude/skills/library-review/scripts/check.js --base origin/main   # the lines you changed
node .claude/skills/library-review/scripts/check.js status               # all of one component
```

It finds things to look at, not verdicts: read each in its file.

## Styles stay apart

There is no shadow DOM. Components are kept apart from each other and from the page by convention:

- A component styles only its own classes (`govuk-app-NAME`, `govuk-app-NAME__part`) and its own element, never another component’s classes or a bare element.
- Its element is `display: contents`, so it takes no part in layout. `component.js` sets that for every component, so its stylesheet doesn’t.
- `<govuk-app>` resets spacing, colour, font, background, shadow and underline for everything inside it, so a page’s styles for `p`, `button` and so on stop at it.
- Components’ styles, and the root’s, aren’t in a cascade layer. A page’s styles that are in one never win over them, however specific. This site loads GOV.UK Frontend into a layer, `govuk-frontend`, for that reason (see `docs/assets/application.scss`).

The reset keeps a page’s ordinary styles out, but not all of them. A page rule more specific than the reset (`#main button { … }`, or GOV.UK Frontend’s `a:visited` and `a:focus`), or for an inherited property the reset doesn’t cover (`letter-spacing`), still reaches in, unless the page’s styles are in a layer. Prototype pages shouldn’t style anything inside `<govuk-app>`, and should load any stylesheets of their own into a layer.

Don’t put a component’s styles in a layer: a page’s styles that aren’t in one would win over them all.
