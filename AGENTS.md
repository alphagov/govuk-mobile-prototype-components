# Working on this repository

Web components that look and behave like the GOV.UK app's own, for prototyping app journeys in HTML. Read the [README](README.md) for what the library is for, and [Build a component](docs/get-started/building-a-component.md) for how a component is put together. These are the rules we've agreed while building it.

## Where things go

- `src/` is the library, and only the library: components, patterns, templates, foundation, frame and schemas, with the prototype starter (`src/starter/`) and the command that makes a prototype from it (`src/bin/`). It's what the package ships, and the docs site publishes the library at the same paths.
- Everything else sits around it: `examples/`, `docs/`, `scripts/`, `inventory/` for the survey of the apps, and `evals/` for the evals of the skills. Generated output (`_site/`, `catalogue/`, `screenshots-out/`, `evals-out/`) is never committed to a branch. Only a release's commit holds `catalogue/`.
- Keep the root to these and the project's own files. Ask before adding a folder there.

## Components

- One folder per component, `src/components/<name>/`: `<name>.html`, `.css`, `.js`, `.json`, an optional `.md`, and `reference/` screenshots. A folder with a definition gets its docs page, index entry and sidebar entry with nothing else to update.
- Web components in light DOM, vanilla JS, no build step, no framework. `src/foundation/component.js` draws each from its template.
- Components send no events of their own: they draw real links, buttons and fields, whose events bubble.
- `catalogue/` is generated from the definitions by `npm run catalogue` (and by `npm run build`). It's in every release, but never on `main`. Run it before reading it. Put a new component in one of the index's groups, in `scripts/catalogue.js`, or the build fails.
- Each definition follows `src/schemas/component.schema.json`. Say where it comes from: the iOS and Android source, with the commit read, and the app's screenshots in `reference/`.
- Call the two kinds **GOV.UK app components** (`origin.kind: "govuk"`, the app's own) and **native components** (`"native"`, mirroring a platform control). The names live in `docs/_data/components.js`.
- Match the app, or for a proposed component, its design. Where we can't, say so in the component's `.md` under "Known differences from the app", or "Known differences from the designs" for a proposed one.
- A component that isn't in the app yet, such as one from future designs, is **proposed**: give its definition `proposed`, saying where its design comes from, and link the design in `sources.figma` once there's a link. Its page is tagged and warned, and it's listed apart. If it ships, remove `proposed` and point its sources at the app.
- Give each definition `avoid`: when the component is the wrong choice, and what to use instead, such as `govuk-app-button variant="destructive"`. Think of the components a designer, or a tool building a prototype, might pick it over by mistake. Write it as an element where the library has one, which the build checks, and in words where it doesn't.
- Use Material Symbols in place of SF Symbols, which may only be used on Apple's platforms. Load their font with `fonts: [materialSymbols]` in `defineComponent` (or `materialSymbolsOutlined`, for the app's topic icons), never an `@import` in the component's CSS: a component waits for its stylesheet, and the font is too big to wait for. The fonts are in `src/foundation/fonts/`, so the library loads nothing from another site: a page with a strict Content Security Policy, or offline, can use it. Give each element drawn in the font the class `govuk-app-icon` as well as its own, so it's hidden until the font has loaded, rather than showing as its name.

## Patterns

- A pattern is a whole screen the app has, in `src/patterns/<name>/`: `<name>.html`, one `<govuk-app-screen>` with generic but real content, and `<name>.json`, following `src/schemas/pattern.schema.json`. Take it from a real screen, and name it in `screen` and `sources`.
- Write `when` and `avoid` so someone could choose between patterns from them alone. `avoid.instead` names another pattern exactly, so its page links to it.
- List in `components` exactly the components the HTML uses: the build checks.

## Templates

- A template is a real screen of the app, or a few that link to each other, as whole pages to copy and change: `src/templates/<name>/`, its pages and `<name>.json`, following `src/schemas/template.schema.json`. iOS only for now.
- Each page is complete: `<govuk-prototype-frame>`, the scripts it needs from `../../components/` and `../../frame/`, and a comment at its top saying what to change and what to leave. Nothing from `examples/`.
- Links between its own pages work. A link to a screen no template has is a named button, not an href to a page that isn't there. The tab bar's tabs link to the other templates' first pages, such as `../home/index.html`.
- List its pages in `screens`, the first where the journey starts, and in `components` exactly the components they use: the build checks. Its docs page is at `/templates/<name>/about/`, since its own `index.html` is at `/templates/<name>/`.
- Templates are their own thing: leave `examples/` as it is.

## Making prototypes

- `src/bin/govuk-app-prototype.js new "<name>"` makes a prototype, for designers who've never used a terminal, run with `npx` from a release's download. It copies `src/starter/` into a new folder, its `skills/` into the prototype's `.claude/skills/`, and installs the components from the latest release's download. It has no dependencies, and the package runs nothing on install.
- A prototype updates with its `prototype-update-library` skill, which runs the new release's `src/starter/scripts/refresh-starter.js`: it replaces a starter file only if the prototype's copy is just as the old release had it, so the designer's changes are kept. Where each file goes in a prototype is its `prototypePath`, which the command uses too.
- Write the starter's `CLAUDE.md` and skills, and anything they tell the designer, in plain words, with no jargon.
- A prototype serves the library's whole package at `/library/`, so a catalogue path is `/library/` and that path. Where the shipped files are inside the package is `source` in `src/starter/library.js` alone: keep it that way, so moving them is a one-line change.
- Check a change to it end to end: `npm pack`, serve the file, and in an empty folder run `npx --yes <its address> new "Test" --components <its address>`. Then open the prototype in Claude Code and say "open my prototype".

## Styles

- A component styles only its own classes, `govuk-app-NAME` and `govuk-app-NAME__part`, with a single class where it can. Never another component's classes, and never a bare element.
- Don't set `display: contents` on a component's element: `component.js` does that for every one.
- Use only `--app-*` tokens from `src/foundation/tokens.css` for colour, type and spacing. Add a missing one there, naming where it comes from (a GovKit token, the Android app, the platform).
- Spacing is on the 8pt grid: `--app-space-extra-small` (4) to `--app-space-extra-large` (32). Keep a value off the grid only where the app itself has it, and say so in a comment, as `button.css` does with GovKit's 13pt.
- Don't put a component's styles in a cascade layer. A page's styles go in one instead (the docs site loads GOV.UK Frontend into `@layer govuk-frontend`), so none of them reach inside `<govuk-app>`.
- In the docs site, style things through our own `docs-` classes. Never select on GOV.UK Frontend's or the Eleventy plugin's classes (`govuk-*`, `x-govuk-*`, `app-*`): add a `docs-` class and style that.
- Support light and dark: tokens use `light-dark()`, so a component that only uses tokens gets both.

## Docs site

- `npm start` serves it at <http://localhost:8080>. `npm run build` must pass. It checks, in `scripts/definitions.js`, `docs/_data/` and `scripts/catalogue.js`:
  - every component's, pattern's and template's definition against its schema;
  - that a component's definition and its script agree on its elements and the attributes each reads;
  - that every element a component's `contains` names is a component or part;
  - that an `avoid` written as an element names one the library has, with attributes it reads and values they take;
  - that a pattern's `avoid` naming another pattern names it exactly;
  - that a pattern's HTML is one `<govuk-app-screen>`, and its `components` are exactly the ones it uses;
  - that a template's pages are there, each loads the script of every component it uses, and its `components` are exactly the ones they use;
  - that every component is in one of the catalogue index's groups, and every name there is a component;
  - and that every component, pattern and template is in the sidebar.
- `npm run check` must pass too: it fails on anything the rule checker must have fixed, such as a raw colour.
- Check each example in light and dark against the references before calling a component done.
- Review a change, yours or a PR, with the `library-review` skill (`.claude/skills/library-review/`) before calling it done: it runs the build, its own checks and the screenshots, and reads the change against these rules.

## Evals

- `evals/` tests the skills, ours and the starter's: whether the right one starts, chooses well, reviews well, and does whole jobs well. Read [evals/README.md](evals/README.md).
- Run them on your own computer, with the `claude` CLI signed in, never in CI: `npm run evals` for the cheap layers, `--full` for whole tasks. They work only in the temporary folder, never in this checkout.
- After changing a skill or its description, run at least the layers it touches, and say what changed in the PR. Add a case for a mistake you've fixed, in `evals/cases/`.
- Publish results to the docs site's Evals page with `--publish`, and commit them in a PR of their own. Only what the page shows is published: no transcripts.

## Writing

- Plain, short UK English, in the voice of the existing docs and comments. Comments say why, not what.
- Commits: a short imperative subject, then a body saying why.

## Releasing

- Release only with the Release workflow (see [Work on the library](docs/get-started/work-on-the-library.md#release-the-library)). It adds the catalogue and the version in a commit that only the tag points to, so `main` stays free of generated files.
- Nothing may run when the package is installed: no `prepare`, `install` or other install script. Installing from GitHub would run it, after installing the dev dependencies. The workflow refuses a release that has one.
- Don't tag by hand, or change `version` on `main`: it stays `0.0.0`.
