# Working on this repository

Web components that look and behave like the GOV.UK app's own, for prototyping app journeys in HTML. Read [PLAN.md](PLAN.md) for what the library is for, and [Build a component](docs/get-started/building-a-component.md) for how a component is put together. These are the rules we've agreed while building it.

## Components

- One folder per component, `components/<name>/`: `<name>.html`, `.css`, `.js`, `.json`, an optional `.md`, and `reference/` screenshots. A folder with a definition gets its docs page, index entry and sidebar entry with nothing else to update.
- Web components in light DOM, vanilla JS, no build step, no framework. `foundation/component.js` draws each from its template.
- Components send no events of their own: they draw real links, buttons and fields, whose events bubble.
- Run `npm run catalogue` after changing a definition, a pattern or a template, and commit `catalogue.json` and `catalogue.md`: the build fails if they're out of date.
- Each definition follows `component.schema.json`. Say where it comes from: the iOS and Android source, with the commit read, and the app's screenshots in `reference/`.
- Call the two kinds **GOV.UK app components** (`origin.kind: "govuk"`, the app's own) and **native components** (`"native"`, mirroring a platform control). The names live in `docs/_data/components.js`.
- Match the app, or for a proposed component, its design. Where we can't, say so in the component's `.md` under "Known differences from the app".
- A component that isn't in the app yet, such as one from future designs, is **proposed**: give its definition `proposed`, saying where its design comes from, and link the design in `sources.figma` once there's a link. Its page is tagged and warned, and it's listed apart. If it ships, remove `proposed` and point its sources at the app.
- Give each definition `avoid`: when the component is the wrong choice, and what to use instead, such as `govuk-app-button variant="destructive"`. Think of the components a designer, or a tool building a prototype, might pick it over by mistake. Write it as an element where the library has one, which the build checks, and in words where it doesn't.
- Use Material Symbols in place of SF Symbols, which may only be used on Apple's platforms. Load their font with `fonts: [materialSymbols]` in `defineComponent` (or `materialSymbolsOutlined`, for the app's topic icons), never an `@import` in the component's CSS: a component waits for its stylesheet, and the font is too big to wait for. The fonts are in `foundation/fonts/`, so the library loads nothing from another site: a page with a strict Content Security Policy, or offline, can use it. Give each element drawn in the font the class `govuk-app-icon` as well as its own, so it's hidden until the font has loaded, rather than showing as its name.

## Patterns

- A pattern is a whole screen the app has, in `patterns/<name>/`: `<name>.html`, one `<govuk-app-screen>` with generic but real content, and `<name>.json`, following `pattern.schema.json`. Take it from a real screen, and name it in `screen` and `sources`.
- Write `when` and `avoid` so someone could choose between patterns from them alone. `avoid.instead` names another pattern exactly, so its page links to it.
- List in `components` exactly the components the HTML uses: the build checks.

## Styles

- A component styles only its own classes, `govuk-app-NAME` and `govuk-app-NAME__part`, with a single class where it can. Never another component's classes, and never a bare element.
- Don't set `display: contents` on a component's element: `component.js` does that for every one.
- Use only `--app-*` tokens from `foundation/tokens.css` for colour, type and spacing. Add a missing one there, naming where it comes from (a GovKit token, the Android app, the platform).
- Spacing is on the 8pt grid: `--app-space-extra-small` (4) to `--app-space-extra-large` (32). Keep a value off the grid only where the app itself has it, and say so in a comment, as `button.css` does with GovKit's 13pt.
- Don't put a component's styles in a cascade layer. A page's styles go in one instead (the docs site loads GOV.UK Frontend into `@layer govuk-frontend`), so none of them reach inside `<govuk-app>`.
- In the docs site, style things through our own `docs-` classes. Never select on GOV.UK Frontend's or the Eleventy plugin's classes (`govuk-*`, `x-govuk-*`, `app-*`): add a `docs-` class and style that.
- Support light and dark: tokens use `light-dark()`, so a component that only uses tokens gets both.

## Docs site

- `npm start` serves it at <http://localhost:8080>. `npm run build` must pass: it checks every definition against the schema, and that every component is in the sidebar.
- Check each example in light and dark against the references before calling a component done.

## Writing

- Plain, short UK English, in the voice of the existing docs and comments. Comments say why, not what.
- Commits: a short imperative subject, then a body saying why.
