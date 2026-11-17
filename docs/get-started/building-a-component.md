---
layout: sub-navigation
title: Build a component
description: How a component is put together, and how to add one to the library.
sectionKey: Get started
order: 2
---

## A component

Each component is one folder, `components/<name>/`:

| File | What it holds |
| --- | --- |
| `<name>.html` | Its template: the markup it draws, in a `<template>` |
| `<name>.css` | Its styles |
| `<name>.js` | Defines its element, `<govuk-app-NAME>`, and works out anything the template can’t say for itself, such as defaults |
| `<name>.json` | Its definition: what it is for, whether it’s a native component or a GOV.UK app component, its inputs and outputs, rules for its use, its sources (Figma, iOS, Android), and examples. It follows `component.schema.json` |
| `<name>.md` | Optional. Prose for its page that the definition can’t say well, such as longer guidance or known differences from the app |
| `reference/` | Screenshots of the app’s own component, to compare it with |

Every folder with a definition gets a page on this site, drawn from the definition. The build checks each definition against `component.schema.json`, and fails if one doesn’t match.

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

There is no build step for components. `foundation/component.js` fetches the template when the page runs and fills it in from the element’s attributes and content, using a few attributes in the template:

| Attribute | |
| --- | --- |
| `data-text="x"` | The element’s text is `x` |
| `data-attr="a: x, b: y"` | Attribute `a` is `x`. `true` sets it empty; `false` or absent leaves it off |
| `data-if="x"` | The element is left out unless `x` is present |
| `data-slot="content"` | The element holds what was written between the component’s tags |

These are the same as in Shaun’s kit in the app prototyping system (`exploration-2/kit`), which this structure is based on.

`foundation/` holds what every component relies on: `tokens.css` (the app’s colours, type, spacing and sizes, each naming where it comes from), `base.css` (the `<govuk-app>` root) and `component.js`.

## Building one

1. Find the component in `COMPONENTS.md`, and read its iOS and Android source.
2. Copy its reference screenshots into `reference/`.
3. Write the four files. Use only `--app-*` tokens for colour, type and spacing; add any missing ones to `foundation/tokens.css`, naming where they come from. Spacing is on the 8pt grid (`--app-space-extra-small` to `--app-space-extra-large`: 4, 8, 16, 24 and 32). Keep a value off the grid only where the app itself has it, and say so in a comment.
4. Run `npm start` and open its page. Check every example against the references, in each state.

## Styles stay apart

There is no shadow DOM. Components are kept apart from each other and from the page by convention:

- A component styles only its own classes (`govuk-app-NAME`, `govuk-app-NAME__part`) and its own element, never another component’s classes or a bare element.
- Its element is `display: contents`, so it takes no part in layout. `component.js` sets that for every component, so its stylesheet doesn’t.
- `<govuk-app>` resets spacing, colour, font, background, shadow and underline for everything inside it, so a page’s styles for `p`, `button` and so on stop at it.
- Components’ styles, and the root’s, aren’t in a cascade layer. A page’s styles that are in one never win over them, however specific. This site loads GOV.UK Frontend into a layer, `govuk-frontend`, for that reason (see `docs/assets/application.scss`).

The reset keeps a page’s ordinary styles out, but not all of them. A page rule more specific than the reset (`#main button { … }`, or GOV.UK Frontend’s `a:visited` and `a:focus`), or for an inherited property the reset doesn’t cover (`letter-spacing`), still reaches in, unless the page’s styles are in a layer. Prototype pages shouldn’t style anything inside `<govuk-app>`, and should load any stylesheets of their own into a layer.

Don’t put a component’s styles in a layer: a page’s styles that aren’t in one would win over them all.
