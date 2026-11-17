# GOV.UK Mobile Prototype Components

Components for the GOV.UK app prototyping system: web components that look and behave like the GOV.UK app's own, so a prototype app journey can be built by writing HTML.

- [PLAN.md](PLAN.md): what the library is for and how we build it.
- [COMPONENTS.md](COMPONENTS.md): every component in the iOS and Android apps today, with screenshots. The backlog.

## Using a component

Load the component's script, and write its element inside a `<govuk-app>`:

```html
<script type="module" src="components/button/button.js"></script>

<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
  <govuk-app-button variant="grouped-secondary" name="skip">Skip</govuk-app-button>
</govuk-app>
```

The script adds everything else the component needs to the page: the app's colours and type, the root's styles, and the component's own stylesheet.

- **`<govuk-app>`** is the root. The app's colours and type exist only inside it. `colour-scheme="light"` or `"dark"` fixes the scheme; otherwise it follows the device. Its size and position are the page's to set.
- **Attributes and content are the inputs.** What each component takes is in its definition file, `components/<name>/<name>.json`, and on the gallery page.
- **The browser's own events are the outputs.** Components draw real buttons and fields, so `click`, `input` and `change` bubble up as usual, carrying the `name` and `value` you gave them.

Serve the folder from any static server; browsers won't load modules from a page opened from disk:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000> for the gallery: every component's examples in light and dark, its definition, and the app's own screenshots to compare it with.

## A component

Each component is one folder, `components/<name>/`:

| File | What it holds |
| --- | --- |
| `<name>.html` | Its template: the markup it draws, in a `<template>` |
| `<name>.css` | Its styles |
| `<name>.js` | Defines its element, `<govuk-app-NAME>`, and works out anything the template can't say for itself, such as defaults |
| `<name>.json` | Its definition: what it is for, whether it mirrors something native or is the GOV.UK app's own, its inputs and outputs, rules for its use, its sources (Figma, iOS, Android), and examples. It follows [`component.schema.json`](component.schema.json) |
| `reference/` | Screenshots of the app's own component, to compare it with |

There is no build step. `foundation/component.js` fetches the template when the page runs and fills it in from the element's attributes and content, using a few attributes in the template:

| Attribute | |
| --- | --- |
| `data-text="x"` | The element's text is `x` |
| `data-attr="a: x, b: y"` | Attribute `a` is `x`. `true` sets it empty; `false` or absent leaves it off |
| `data-if="x"` | The element is left out unless `x` is present |
| `data-slot="content"` | The element holds what was written between the component's tags |

These are the same as in Shaun's kit in the app prototyping system (`exploration-2/kit`), which this structure is based on.

`foundation/` holds what every component relies on: `tokens.css` (the app's colours and type, from GovKit, each naming the GovKit token it comes from), `base.css` (the `<govuk-app>` root) and `component.js`.

### Building one

1. Find the component in [COMPONENTS.md](COMPONENTS.md), and read its iOS and Android source.
2. Copy its reference screenshots into `reference/`.
3. Write the four files. Use only `--app-*` tokens for colour and type; add any missing ones to `foundation/tokens.css`, naming the GovKit token they come from.
4. Add its folder name to the list in `gallery/gallery.js`, and check every example against the references, in each state.

### Styles stay apart

There is no shadow DOM. Components are kept apart from each other and from the page by convention:

- A component styles only its own classes (`govuk-app-NAME`, `govuk-app-NAME__part`) and its own element, never another component's classes or a bare element.
- Its element is `display: contents`, so it takes no part in layout.
- `<govuk-app>` resets spacing, colour and font for everything inside it, so a page's styles for `p`, `button` and so on stop at it.

This keeps the page's ordinary styles out, but not all of them. A page rule more specific than the reset (`#main button { … }`), or for an inherited property the reset doesn't cover (`letter-spacing`), still reaches in. Prototype pages shouldn't style anything inside `<govuk-app>`.
